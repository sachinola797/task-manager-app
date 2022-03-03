const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail, sendDepartureEmail} = require('../emails/account');

const userRouter = new express.Router();

// create user
userRouter.post('/users/create', async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = await user.generateAuthToken();
        sendWelcomeEmail(req.body.email, req.body.name);
        res.status(201).send({
            user,
            token
        });
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// creating upload middleware
const upload = multer({
    // dest: 'avatars',  // To save the data locally
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        // cb(new Error('File must be pdf'));
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

// upload user avatar
userRouter.post('/users/upload/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();    
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send({message: 'Avatar uploaded successfully!'})
}, (err, req, res, next) => {
    res.status(400).send({err: err.message});
});

// delete user avatar
userRouter.delete('/users/delete/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({message: 'Avatar deleted successfully!'})
});

// fetch user avatar by id
userRouter.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user && !user.avatar) {
            return res.status(400).send("Unable to fetch the avatar");
        }
        res.setHeader('Content-Type', 'image/png')
        res.status(200).send(user.avatar);
    } catch (err) {
        res.status(500).send(err);
    }
});

// read all user
userRouter.get('/users', auth, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(401).send({message: 'Action not allowed'});
    }
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});



// user login
userRouter.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({
            user,
            token
        });
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// user logout
userRouter.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.status(200).send({message:'User logged out!'});
    } catch (err) {
        res.status(500).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// user logout from all devices
userRouter.get('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send({message:'User logged out from all devices!'});
    } catch (err) {
        res.status(500).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// update single user by id
userRouter.patch('/users/update/:id', auth, async (req, res) => {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'ADMIN') {
        return res.status(401).send({message: 'Action not allowed'});
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "password", "age"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({errName: "Invalid upates!", errorMessage: "Trying to update invalid or non-updateable properties"})
    }
    
    try {
        const user = req.user._id.toString() !== req.params.id ? await User.findById(req.params.id) : req.user;
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }
        updates.forEach(update => user[update] = req.body[update]);
        const updatedUser = await user.save();
        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});


// delete single user
userRouter.delete('/users/delete/:id', auth, async (req, res) => {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'ADMIN') {
        return res.status(401).send({message: 'Action not allowed'});
    }
    try {
        console.log(req.user);
        const user = req.user._id.toString() !== req.params.id ? await User.findOne({_id: req.params.id}): req.user;
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }
        sendDepartureEmail(user.email, user.name);
        await user.remove();
        res.status(200).send("User deleted successfully!");
    } catch (err) {
        res.status(500).send(err);
    }
});

// read all user
userRouter.get('/users', auth, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(401).send({message: 'Action not allowed'});
    }
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// read single user (only for admin)
userRouter.get('/users/:id', auth, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(401).send({message: 'Action not allowed'});
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = userRouter;