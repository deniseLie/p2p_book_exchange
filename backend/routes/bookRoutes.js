const express = require('express');
const router = express.Router();
const {
    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById
} = require('../controllers/bookController');

// Fetch all books
router.get('/', getAllBooks);

// Fetch a single book by ID
router.get('/:bookId', getBookById);

// Add a new book
router.post('/', createBook);

// Update a book by ID
router.put('/:bookId', updateBookById);

// Delete a book by ID
router.delete('/:bookId', deleteBookById);

module.exports = router;
