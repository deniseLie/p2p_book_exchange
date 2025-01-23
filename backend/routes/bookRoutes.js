const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');

// Fetch all books
router.get('/', verifyToken, bookController.getAllBooks);

// Search from all books
router.get('/search', verifyToken, bookController.getBookSearch);

// Fetch a single book by ID
router.get('/:bookId', verifyToken, bookController.getBookById);

// Add a new book
router.post('/', verifyToken, bookController.createBook);

// Update a book by ID
router.put('/:bookId', verifyToken, bookController.updateBookById);

// Delete a book by ID
router.delete('/:bookId', verifyToken, bookController.deleteBookById);

module.exports = router;
