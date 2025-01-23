const express = require('express');
const router = express.Router();
const browseUserBookController = require('../controllers/browseUserBookController');
const { verifyToken } = require('../middleware/authMiddleware');

// Browse books
router.get('/books', verifyToken, browseUserBookController.browseBooks);

// Browse userBooks
router.get('/userbooks', verifyToken, browseUserBookController.browseUserBooks);

// Browse available not listed books by user
router.get('/unlistedBookByUserId', verifyToken, browseUserBookController.getBookSearchNotListedUser);

// Get details of a specific user's book
router.get('/:userBookId', verifyToken, browseUserBookController.browseUserBook);

module.exports = router;
