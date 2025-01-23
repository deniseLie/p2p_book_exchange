const express = require('express');
const { getAllUsers, registerUser, loginUser, updateUserProfile, sendPasswordResetEmail, resetPassword } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all Users
router.get('/', getAllUsers);

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Update user profile
router.put('/profile', verifyToken, updateUserProfile);

// Send password reset email
router.post('/password-reset', sendPasswordResetEmail);

// Reset password with reset token
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
