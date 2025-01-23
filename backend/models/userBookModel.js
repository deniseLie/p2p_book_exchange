const mongoose = require('mongoose');

// Define UserBook Schema
const userBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookStatus: { 
    type: String, 
    enum: ['pending', 'available', 'exchanged', 'review'], 
    default: 'available' 
  },
  bookCondition: { 
    type: String, 
    enum: ['new', 'good', 'fair', 'poor'], 
    default: 'good' 
  },
  createdAt: { type: Date, default: Date.now },
});

// Export the UserBook model
module.exports = mongoose.model('UserBook', userBookSchema);
