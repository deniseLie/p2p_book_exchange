const express = require('express');
const { registerUser, loginUser, updateUserProfile, sendPasswordResetEmail, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Send password reset email
router.post('/password-reset', sendPasswordResetEmail);

// Reset password with reset token
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
