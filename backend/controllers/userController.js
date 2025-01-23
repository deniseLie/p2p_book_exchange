const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

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
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login User with JWT
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
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
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

const updateUserProfile = async (req, res) => {
    const { name, location, bio } = req.body;
  
    try {
        // Find and update user
        const user = await User.findByIdAndUpdate(
            req.user.id, // Ensure you authenticate the user first
            { name, location, bio },
            { new: true } // Return updated document
        );
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
            bio: user.bio,
        });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
};

// Password Reset Email
const sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

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
            },
        });

        const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `To reset your password, please click on the following link: ${resetUrl}`,
        }

        transporter.sendMail(message, (error, info) => {
            if (error) {
              return res.status(500).json({ message: 'Email could not be sent' });
            }
            res.json({ message: 'Password reset link sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Reset Password 
const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

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

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    sendPasswordResetEmail,
    resetPassword
};