const Book = require('../models/bookModel');

// Create a new book
exports.createBook = async (req, res) => {
    try {
        const { title, author, genre} = req.body;
        const newBook = new Book({ title, author, genre });
        await newBook.save();
        res.status(201).json({ message: 'Book created successfully', newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

exports.getBookSearch = async (req, res) => {
    try {
        const query = req.query.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // Escape special regex characters in the query string to prevent regex errors
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        
        const books = await Book.find({ title: { $regex: query, $options: "i" } }).select("id title author genre description");
        res.status(200).json(books);
    } catch (error) {
        console.error("Error searching books:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a book by ID
exports.getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

// Update a book by ID (e.g., change description, cover image)
exports.updateBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book updated successfully', updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// Delete a book
exports.deleteBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully', deletedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};