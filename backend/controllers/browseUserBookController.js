const UserBook = require('../models/userBookModel');
const Book = require('../models/bookModel');

// Browse available books with optional filters, sorting, and pagination
exports.browseBooks = async (req, res) => {
    try {
        // Extract query parameters for filtering, sorting, and pagination
        const { title, author, genre, condition, sortBy, page = 1, limit = 10 } = req.query;

        // Build a filter object
        const filter = { bookStatus: 'available' }; // Only fetch available books

        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (author) filter.author = { $regex: author, $options: 'i' };
        if (genre) filter.genre = { $regex: genre, $options: 'i' };
        if (condition) filter.bookCondition = condition; // Exact match for condition

        // Populate and paginate results
        const books = await UserBook.find(filter)
            .populate('bookId') // Join with the Book model to get detailed book info
            .sort(sortBy ? { [sortBy]: 1 } : { createdAt: -1 }) // Sort by field (default: newest)
            .skip((page - 1) * limit) // Skip records for pagination
            .limit(parseInt(limit)); // Limit records per page

        // Count total available books for pagination info
        const totalBooks = await UserBook.countDocuments(filter);

        // Send response with books and pagination info
        res.status(200).json({
            books,
            pagination: {
                totalBooks,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBooks / limit),
            },
        });
    } catch (error) {
        console.error('Error browsing books:', error);
        res.status(500).json({ message: 'Error browsing books', error });
    }
};

const UserBook = require('../models/userBookModel');

// Get all userBooks
exports.browseUserBooks = async (req, res) => {
    try {
        const userBooks = await UserBook.find()
            .populate('bookId') // Populate book details
            .populate('userId', 'username email'); // Populate user details with only username and email

        res.status(200).json(userBooks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user books', error });
    }
};
