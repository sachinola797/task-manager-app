const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const taskRouter = new express.Router();

// create task
taskRouter.post('/tasks/create', auth, async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            owner: req.user._id,
        });
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// read single task
taskRouter.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) {
            return res.status(404).send("Task doesn't exist");
        }
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

// read all tasks
// GET /tasks?completed=false
// Pagination:- GET /tasks?limit=10&skip={0,10,20}
// Sorting:- Get /tasks?sortBy=createdAt:desc,completed:asc
taskRouter.get('/tasks', auth, async (req, res) => {
    const filters = { owner: req.user._id };
    const sortOptions = {};
    if (req.query.completed) {
        filters.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const options = req.query.sortBy.split(',');
        options.forEach(option => {
            const parts = option.split(':');
            if (parts.length === 2 && parts[0] != '' && ['asc', 'desc'].includes(parts[1])) {
                sortOptions[parts[0]] = parts[1];
            }
        })
    }
    try {
        const tasks = await Task.find(filters)
                                .limit(req.query.limit || 20)
                                .skip(req.query.skip || 0)
                                .sort(sortOptions);
        res.status(200).send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update single task by id
taskRouter.patch('/tasks/update/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "completed"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({errName: "Invalid upates!", errorMessage: "Trying to update invalid or non-updateable properties"})
    }
    
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) {
            return res.status(404).send("Task doesn't exist");
        }
        updates.forEach(update => task[update] = req.body[update]);
        const updatedTask = await task.save();
        
        res.status(200).send(updatedTask);
    } catch (err) {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    }
});

// delete single task
taskRouter.delete('/tasks/delete/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) {
            return res.status(404).send("Task doesn't exist");
        }
        res.status(200).send("Task deleted successfully!");
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = taskRouter;
