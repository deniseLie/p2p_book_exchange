const mongoose = require('mongoose');

// Define Message Schema
const messageSchema = new mongoose.Schema({
  exchangeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Exchange', required: true }, // The exchange this message belongs to
  senderUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageContent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the Message model
module.exports = mongoose.model('Message', messageSchema);
