const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all Users
router.get('/', userController.getAllUsers);

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Check email availability
router.post('/check-email', userController.checkEmailAvailability);

// Send password reset email
router.post('/password-reset', userController.sendPasswordResetEmail);

// Reset password with reset token
router.put('/reset-password/:resetToken', userController.resetPassword);

// Get user profile
router.get('/profile', verifyToken, userController.getUserProfile);

// Update user profile
router.put('/profile', verifyToken, userController.updateUserProfile);

module.exports = router;
