const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Sachin",
    email: 'sachin@gmail.com',
    password: 'Test@1234',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET),
    }],
};

const setupDatabase = async() => {
    await User.deleteMany();
    await User.create(userOne);
}

module.exports = {
    userOne,
    setupDatabase,
}