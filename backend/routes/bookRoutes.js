const express = require('express');
const { Book } = require('./models');
const router = express.Router();

router.post('/books', async (req, res) => {
  const { title, author, genre, condition, ownerId, location, coverImageUrl } = req.body;
  try {
    const newBook = new Book({ title, author, genre, condition, ownerId, location, coverImageUrl });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

module.exports = router;
