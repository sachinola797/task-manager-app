const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Please provide a positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Please choose a strong password');
            }
        }
    },
    role: {
        type: String,
        required: true,
        trim: true,
        default: 'USER',
    },
    avatar: {
        type: Buffer,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true,
});

// creating relationship with Task model
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

// hide private data
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// generates jwt for a user
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '7 days'});
    user.tokens = [...user.tokens, { token } ];
    await user.save();

    return token;
}


// find user by login credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email or password 1');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect email or password 2');
    }
    
    return user;
}


// Hash the plain text password before saving (if required)
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Delete all linked tasks
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;