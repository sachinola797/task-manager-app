const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decodedToken._id, 'tokens.token': token});
        if (!user) {
            throw new Error('User not found!');
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({error:'Please authenticate!'});
    }
}

module.exports = auth;