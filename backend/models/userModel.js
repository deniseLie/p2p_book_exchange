const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords
  location: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
