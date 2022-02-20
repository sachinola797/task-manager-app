const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// create user
app.post('/users/create', (req, res) => {
    User.create(req.body).then(result => {
        console.log('User created successfully!');
        res.status(201).send(result);
    }).catch(err => {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    })
});

// read single user
app.get('/users/:id', (req, res) => {
    User.findById(req.params.id).then(user => {
        if (!user) {
            return res.status(400).send();
        }
        res.status(200).send(user);
    }).catch(err => {
        res.status(500).send(err);
    })
});

// read all user
app.get('/users', (req, res) => {
    User.find({}).then(users => {
        res.status(200).send(users);
    }).catch(err => {
        res.status(500).send(err);
    })
});

// create task
app.post('/tasks/create', (req, res) => {
    Task.create(req.body).then(result => {
        console.log('Task created successfully!');
        res.status(201).send(result);
    }).catch(err => {
        res.status(400).send({
            errorName: err.name,
            errorMessage: err.message,
        });
    })
});

// read single task
app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id).then(user => {
        if (!user) {
            return res.status(400).send();
        }
        res.status(200).send(user);
    }).catch(err => {
        res.status(500).send(err);
    })
});

// read all tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then(users => {
        res.status(200).send(users);
    }).catch(err => {
        res.status(500).send(err);
    })
});


app.listen(port, () => {
    console.log('Server is running on', port);
});