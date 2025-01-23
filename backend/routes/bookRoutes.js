const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
} = require('../controllers/bookController');

// Fetch all books
router.get('/', getBooks);

// Fetch a single book by ID
router.get('/:id', getBookById);

// Add a new book
router.post('/', addBook);

// Update a book by ID
router.put('/:id', updateBook);

// Delete a book by ID
router.delete('/:id', deleteBook);

module.exports = router;
