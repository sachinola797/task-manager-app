const express = require('express');
const User = require('../models/user');

const userRouter = new express.Router();

// create user
userRouter.post('/users/create', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// read single user
userRouter.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

// read all user
userRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update single user by id
userRouter.patch('/users/update/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "password", "age"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({errName: "Invalid upates!", errorMessage: "Trying to update invalid or non-updateable properties"})
    }
    
    try {
        const user = await User.findOneAndUpdate({
                    _id: req.params.id
                }, req.body,
                { 
                    upsert: false,
                    runValidators: true, 
                    returnDocument: 'after'
                }
            );
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});


// delete single user
userRouter.delete('/users/delete/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({_id: req.params.id});
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }
        res.status(200).send("User deleted successfully!");
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = userRouter;