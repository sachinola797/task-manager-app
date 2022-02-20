const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    // useCreateIndex: true
});

// const me = new User({
//     name: 'Sachin Olla',
//     email: 'sachin@gmail.com',
//     password: ' ad$gsdgsd    ',
//     age: 45,
// })

// me.save().then(result => {
//     console.log(result);
// }).catch(err => {
//     console.log(err);
// })

// Task.create({
//     description: '  Buy a tester     ',
//     // completed: false
// }).then(result => {
//     console.log(result);
// }).catch(err => {
//     console.log(err);
// })