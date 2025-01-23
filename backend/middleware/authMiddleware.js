const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyToken = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.status(403).json({ message: 'Access Denied. No token provided.' });
            }        

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            // If the token is expired or invalid
            res.status(401).json({ message: 'Token has expired or is invalid. Please login again.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
}

module.exports = { verifyToken };