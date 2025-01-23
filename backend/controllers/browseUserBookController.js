const UserBook = require('../models/userBookModel');
const Book = require('../models/bookModel');

// Browse available books with optional filters, sorting, and pagination
exports.browseBooks = async (req, res) => {
    try {
        // Extract query parameters for filtering, sorting, and pagination
        const { title, author, genre, condition, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

        // Build a filter object
        const filter = { bookStatus: 'available' }; // Only fetch available books

        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (author) filter.author = { $regex: author, $options: 'i' };
        if (genre) filter.genre = { $regex: genre, $options: 'i' };
        if (condition) filter.bookCondition = condition; // Exact match for condition

        // Calculate pagination values
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch filtered and paginated results
        const books = await UserBook.find(filter)
            .populate('bookId') // Join with the Book model to get detailed book info
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 }) // Sort by the specified field and order
            .skip(skip) // Skip records for pagination
            .limit(limitNumber); // Limit records per page

        // Count total available books for pagination info
        const totalBooks = await UserBook.countDocuments(filter);

        // Send response with books and pagination info
        res.status(200).json({
            books,
            pagination: {
                totalBooks,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalBooks / limitNumber),
            },
        });
    } catch (error) {
        console.error('Error browsing books:', error);
        res.status(500).json({ message: 'Error browsing books', error });
    }
};

// Get all userBooks
exports.browseUserBooks = async (req, res) => {
    try {
        // Extract query parameters for filtering, sorting, and pagination
        const {
            title,
            author,
            genre,
            bookCondition,
            username,
            email,
            bookStatus,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10,
        } = req.query;

        // User Id
        const currentUserId = req.user._id; 
        
        // Build a filter object
        const filter = {};
        
        // Exclude books listed by the current user
        filter.userId = { $ne: currentUserId };

        // Apply filters for books
        if (bookCondition) filter.bookCondition = bookCondition; // Exact match for condition
        if (bookStatus) filter.bookStatus = bookStatus; // Match book status (e.g., 'available', 'pending')

        // Apply filters for users
        if (username) filter['userId.username'] = { $regex: username, $options: 'i' }; // Case-insensitive username search
        if (email) filter['userId.email'] = { $regex: email, $options: 'i' }; // Case-insensitive email search

        // Calculate pagination values
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch filtered and paginated results
        const userBooks = await UserBook.find(filter)
            .populate({
                path: 'bookId',
                match: {
                    ...(title && { title: { $regex: title, $options: 'i' } }),
                    ...(author && { author: { $regex: author, $options: 'i' } }),
                    ...(genre && { genre: { $regex: genre, $options: 'i' } }),
                },
            }) // Populate book details with filtering
            .populate({
                path: 'userId',
                match: {
                    ...(username && { username: { $regex: username, $options: 'i' } }),
                    ...(email && { email: { $regex: email, $options: 'i' } }),
                },
                select: 'username email', // Only select username and email fields
            }) // Populate user details with filtering
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 }) // Sort by the specified field and order
            .skip(skip) // Skip records for pagination
            .limit(limitNumber); // Limit records per page

        // Count total userBooks for pagination info
        const totalUserBooks = await UserBook.countDocuments(filter);

        // Send response with userBooks and pagination info
        res.status(200).json({
            userBooks,
            pagination: {
                totalUserBooks,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalUserBooks / limitNumber),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user books', error });
    }
};

// Get one specific book
exports.browseUserBook = async (req, res) => {
    try {
        const { userBookId } = req.params;

        // Find the specific UserBook entry by ID and populate book details
        const userBook = await UserBook.findById(userBookId)
            .populate('bookId') // Include book details
            .populate('userId', 'username email location bio'); // Include user details (only selected fields)

        if (!userBook) {
            return res.status(404).json({ message: 'UserBook not found' });
        }

        // Find other books owned by the same user (excluding the current book)
        const otherBooks = await UserBook.find({
            userId: userBook.userId._id,
            _id: { $ne: userBookId }, // Exclude the current book
        }).populate('bookId');

        // Respond with detailed information
        res.status(200).json({
            userBookDetails: {
                userBook,
                otherBooksOwned: otherBooks,
            },
        });
    } catch (error) {
        console.error('Error fetching user book details:', error);
        res.status(500).json({ message: 'Error fetching user book details', error });
    }
};

// Browse available not listed books by user
exports.getBookSearchNotListedUser = async (req, res) => {
    try {
        const query = req.query.query;
        const userId = req.user._id; 

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Escape special regex characters in the query string to prevent regex errors
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Step 1: Find all bookIds related to the userId
        const userBooks = await UserBook.find({ userId }).select("bookId");
        const userBookIds = userBooks.map((ub) => ub.bookId);

        // Step 2: Query the books collection, excluding books already associated with the user
        const books = await Book.find({
            title: { $regex: escapedQuery, $options: "i" },
            _id: { $nin: userBookIds } // Exclude books in the user's list
        }).select("id title author genre description");

        res.status(200).json(books);
    } catch (error) {
        console.error("Error searching books:", error);
        res.status(500).json({ message: "Server error" });
    }
};
