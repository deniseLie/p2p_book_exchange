const express = require('express');
const router = express.Router();
const userBookController = require('../controllers/userBookController');

// Get all books of a user
router.get('/', userBookController.getUserBooks);

// Add a book to user's collection
router.post('/', userBookController.addUserBook);

// Change the status of a user's book
router.put('/:userBookId', userBookController.updateBookStatus);

// Change the condition of a user's book
router.put('/:userBookId/condition', userBookController.updateBookCondition);

// Delete a user's book
router.delete('/:userBookId', userBookController.deleteUserBook);

module.exports = router;