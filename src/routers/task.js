const express = require('express');
const Task = require('../models/task');

const taskRouter = new express.Router();

// create task
taskRouter.post('/tasks/create', async (req, res) => {
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
taskRouter.get('/tasks/:id', async (req, res) => {
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
taskRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update single task by id
taskRouter.patch('/tasks/update/:id', async (req, res) => {
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
taskRouter.delete('/tasks/delete/:id', async (req, res) => {
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

module.exports = taskRouter;