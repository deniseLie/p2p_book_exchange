const UserBook = require('../models/userBookModel');
const Book = require('../models/bookModel');

// Get all books of a user
exports.getUserBooks = async (req, res) => {
    try {
        const { userId } = req.params;
        const userBooks = await UserBook.find({ userId }).populate('bookId');
        res.status(200).json(userBooks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user books', error });
    }
};

// Add an existing book to the user's collection
exports.addUserBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const newUserBook = new UserBook({ userId, bookId });
        await newUserBook.save();
        res.status(201).json({ message: 'Book added to user collection', newUserBook });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book to user collection', error });
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
