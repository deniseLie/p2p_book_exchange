const express = require('express');
const router = express.Router();
const { browseBooks, browseUsers, browseUserBooks } = require('../controllers/browseController');

// Browse books
router.get('/books', browseBooks);

// Browse userBooks
router.get('/userbooks', browseUserBooks);

module.exports = router;
