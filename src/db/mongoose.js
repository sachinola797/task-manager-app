const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGODB_REMOTE_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true
});
