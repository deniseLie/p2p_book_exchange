const express = require('express');
const router = express.Router();
const {
    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById
} = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');

// Fetch all books
router.get('/', verifyToken, getAllBooks);

// Fetch a single book by ID
router.get('/:bookId', verifyToken, getBookById);

// Add a new book
router.post('/', verifyToken, createBook);

// Update a book by ID
router.put('/:bookId', verifyToken, updateBookById);

// Delete a book by ID
router.delete('/:bookId', verifyToken, deleteBookById);

module.exports = router;
