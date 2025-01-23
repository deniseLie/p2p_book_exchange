const mongoose = require('mongoose');

// Define Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  condition: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  location: { type: String, required: false },
  coverImageUrl: { type: String, required: false }, // URL to the book's cover image
  createdAt: { type: Date, default: Date.now },
});

// Export the Book model
module.exports = mongoose.model('Book', bookSchema);
