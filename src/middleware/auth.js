const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, 'Task-Mananger-App!Author-Sachin_Olla!sadgs325tdf');
        const user = await User.findOne({_id: decodedToken._id, 'tokens.token': token});

        if (!user) {
            throw new Error('User not found!');
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({error:'Please authenticate!'});
        next();
    }
}

module.exports = auth;