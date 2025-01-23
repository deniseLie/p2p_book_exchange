const express = require('express');
const router = express.Router();
const browseUserBookController = require('../controllers/browseUserBookController');
const { verifyToken } = require('../middleware/authMiddleware');

// Browse books
router.get('/books', browseUserBookController.browseBooks);

// Browse userBooks
router.get('/userbooks', browseUserBookController.browseUserBooks);

// Get details of a specific user's book
router.get('/:userBookId', verifyToken, browseUserBookController.browseUserBook);

module.exports = router;
