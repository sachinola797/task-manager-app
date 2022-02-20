const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Task', {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

module.exports = Task;