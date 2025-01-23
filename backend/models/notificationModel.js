const mongoose = require('mongoose');

// Define Notification Schema
const notificationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  exchangeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Exchange', required: true }, // Reference to the exchange
  status: { 
    type: String, 
    enum: ['unread', 'read'],
    default: 'unread'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export the Notification model
module.exports = mongoose.model('Notification', notificationSchema);
