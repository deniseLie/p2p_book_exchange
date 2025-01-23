const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields: username, email, and password' });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password (at least 8 characters, 1 number, 1 uppercase, 1 special character)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.'
        });
    }

    // Validate username (no spaces or special characters)
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allow only alphanumeric characters and underscores
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'User registered successfully',
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login User with JWT
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Check if all required fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
    
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

exports.updateUserProfile = async (req, res) => {
    const { username, location, bio } = req.body;
  
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized, please log in first' });
    }

    // Ensure the request body is not empty
    if (!username && !location && !bio) {
        return res.status(400).json({ message: 'Please provide at least one field to update (username, location, or bio)' });
    }

    // Validate username (no spaces or special characters)
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allow only alphanumeric characters and underscores
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
    }

    try {
        // Find and update user
        const user = await User.findByIdAndUpdate(
            req.user.id, // Ensure you authenticate the user first
            { username, location, bio },
            { new: true } // Return updated document
        );
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            location: user.location,
            bio: user.bio,
        });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
};

// Password Reset Email
exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: 'Please provide an email' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token expiry - 10 minutes
        const resetExpires = Date.now() + 10 * 60 * 1000;

        // Save token and expiration in the database
        user.resetPasswordToken = hashedResetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Send password reset email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        const message = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            text: `To reset your password, please click on the following link: ${resetUrl}`,
        }

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Email could not be sent' });
            }
            res.json({ message: 'Password reset link sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Reset Password 
exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    // Check if resetToken and newPassword are provided
    if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Please provide both reset token and new password' });
    }

    // Validate password (at least 8 characters, 1 number, 1 uppercase, 1 special character)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.'
        });
    }

    try {
        // Hash the provided reset token
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // Find user by reset token and check if it hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedResetToken,
            resetPasswordExpires: { $gt: Date.now() }, // token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Check if the new password is the same as the current (old) password
        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password and reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};