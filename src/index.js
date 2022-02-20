const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// create user
app.post('/users/create', async (req, res) => {
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
app.get('/users/:id', async (req, res) => {
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
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update single user by id
app.patch('/users/update/:id', async (req, res) => {
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
app.delete('/users/delete/:id', async (req, res) => {
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

// create task
app.post('/tasks/create', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// read single task
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        console.log(task);
        if (!task) {
            return res.status(404).send("Task doesn't exist");
        }
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

// read all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update single task by id
app.patch('/tasks/update/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "completed"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({errName: "Invalid upates!", errorMessage: "Trying to update invalid or non-updateable properties"})
    }
    
    try {
        const task = await Task.findOneAndUpdate({
                    _id: req.params.id
                }, req.body,
                { 
                    upsert: false,
                    runValidators: true, 
                    returnDocument: 'after'
                }
            );
        if (!task) {
            return res.status(404).send("Task doesn't exist");
        }
        res.status(200).send(task);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// delete single task
app.delete('/tasks/delete/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id});
        if (!task) {
            return res.status(404).send("Task doesn't exist");
        }
        res.status(200).send("Task deleted successfully!");
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(port, () => {
    console.log('Server is running on', port);
});