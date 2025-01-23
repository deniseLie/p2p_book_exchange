const UserBook = require('../models/userBookModel');

// Get all books of a user
exports.getUserBooksbyUserId = async (req, res) => {
    try {
        const userId = req.user._id; 

        const userBooks = await UserBook.find({ userId }).populate('bookId');
        res.status(200).json(userBooks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user books', error });
    }
};

// Get all books of a user
exports.getUserBooksAvailablebyUserId = async (req, res) => {
  try {
      const userId = req.user._id; 

      const userBooks = await UserBook.find({ userId, bookStatus: 'available' }).populate('bookId');
      res.status(200).json(userBooks);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user books', error });
  }
};

// Add a book to user's collection
exports.addUserBook = async (req, res) => {
    try {
        const userId = req.params;  // Extract userId from param
        const { bookId, bookStatus = 'available', bookCondition } = req.body;

        // Check if the book already exists in the user's collection
        const existingBook = await UserBook.findOne({ userId, bookId });
        if (existingBook) {
            return res.status(400).json({ message: 'Book already in your collection' });
        }

        // Add book to user's collection
        const newUserBook = new UserBook({
            userId,
            bookId,
            bookStatus,
            bookCondition,
        });

        await newUserBook.save();
        res.status(201).json({ message: 'Book added to your collection', userBook: newUserBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding book to collection' });
    }
};

// Change the status of a user's book (e.g., from available to pending)
exports.updateBookStatus = async (req, res) => {
  try {
    const { userBookId } = req.params;
    const { bookStatus } = req.body;
    const updatedUserBook = await UserBook.findByIdAndUpdate(userBookId, { bookStatus }, { new: true });
    if (!updatedUserBook) return res.status(404).json({ message: 'UserBook not found' });
    res.status(200).json({ message: 'Book status updated successfully', updatedUserBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book status', error });
  }
};

// Change the condition of a user's book (e.g., from good to fair)
exports.updateBookCondition = async (req, res) => {
  try {
    const { userBookId } = req.params;
    const { bookCondition } = req.body;
    const updatedUserBook = await UserBook.findByIdAndUpdate(userBookId, { bookCondition }, { new: true });
    if (!updatedUserBook) return res.status(404).json({ message: 'UserBook not found' });
    res.status(200).json({ message: 'Book condition updated successfully', updatedUserBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book condition', error });
  }
};

// Delete a user's book (removing from user collection)
exports.deleteUserBook = async (req, res) => {
  try {
    const { userBookId } = req.params;
    const deletedUserBook = await UserBook.findByIdAndDelete(userBookId);
    if (!deletedUserBook) return res.status(404).json({ message: 'UserBook not found' });
    res.status(200).json({ message: 'UserBook deleted successfully', deletedUserBook });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting userBook', error });
  }
};