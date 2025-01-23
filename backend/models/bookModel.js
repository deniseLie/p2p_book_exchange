const mongoose = require('mongoose');

// Define Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  coverImage: { type: Buffer }, // Store the image as a Buffer
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// Export the Book model
module.exports = mongoose.model('Book', bookSchema);
