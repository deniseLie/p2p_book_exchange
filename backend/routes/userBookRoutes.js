const express = require('express');
const router = express.Router();
const userBookController = require('../controllers/userBookController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all books that's available


// Get all books of a user
router.get('/', verifyToken, userBookController.getUserBooksbyUserId);

// Add a book to user's collection
router.post('/', verifyToken, userBookController.addUserBook);

// Change the status of a user's book
router.put('/:userBookId', verifyToken, userBookController.updateBookStatus);

// Change the condition of a user's book
router.put('/:userBookId/condition', verifyToken, userBookController.updateBookCondition);

// Delete a user's book
router.delete('/:userBookId', verifyToken, userBookController.deleteUserBook);

module.exports = router;