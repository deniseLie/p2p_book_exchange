import React, { useState } from "react";
import "../../css/components/AddBook.css"; // Optional: Add styling if needed
import { useAuthContext } from "../../context/AuthContext";
import { getUnlistedBookByUserId } from "../../axios/browse_req";

export default function AddBook({ onSubmit, list = false, interest = false }) {
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        genre: "",
        bookCondition: "",
        // coverImage: null, // File for the cover image
        // description: "",
        bookId: null, // To store the selected book ID
    });

    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const { authToken } = useAuthContext();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset all fields if title changes and doesn't match bookId
        if (name === 'title' && bookData.bookId) {
            setBookData({
                title: value,
                author: "",
                genre: "",
                coverImage: null,
                // description: "",
                bookId: null,
            });
        } else {
            setBookData({ ...bookData, [name]: value });
        }

        // Trigger search for the title field
        if (name === 'title') {
            fetchSuggestions(value);
        }
    };

    // const handleFileChange = (e) => {
    //     setBookData({ ...bookData, coverImage: e.target.files[0] });
    // };

    // Fetch matching books from the backend
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        setLoadingSuggestions(true);

        try {
            const response = await getUnlistedBookByUserId(authToken, query);
            setSuggestions(response || []);
            console.log(response)
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (book) => {
        console.log(book);
        setBookData({
            ...bookData,
            title: book.title,
            author: book.author,
            genre: book.genre,
            // description: book.description || "",
            bookId: book._id,
        });
        setSuggestions([]);
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs
        if ((!bookData.title || !bookData.author || !bookData.genre) && 
            (list && !bookData.bookCondition)
        ) {
            alert("Please fill in all fields!");
            return;
        }

        // // Prepare data for submission
        // const formData = new FormData();
        // formData.append("title", bookData.title);
        // formData.append("author", bookData.author);
        // formData.append("genre", bookData.genre);

        // if (list) formData.append("bookCondition", bookData.bookCondition);
        // // formData.append("coverImage", bookData.coverImage);
        // // formData.append("description", bookData.description);
        // if (bookData.bookId) {
        //     formData.append("bookId", bookData.bookId); // Add the book ID if selected
        // }

        // // Pass formData to the parent or API request
        onSubmit(bookData);

        // Reset the form after submission
        setBookData({
            title: "",
            author: "",
            genre: "",
            bookCondition: "",
            // coverImage: null,
            // description: "",
            bookId: null,
        });
    };

    return (
        <div className="add-book">
            <form onSubmit={handleSubmit} className="add-book-form">
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={bookData.title}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                    {loadingSuggestions && <p>Loading suggestions...</p>}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((book, id) => (
                                <li
                                    key={book?.id || book?._id}
                                    onClick={() => handleSuggestionClick(book)}
                                    className="suggestion-item"
                                >
                                    {book.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={bookData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="genre">Genre:</label>
                    <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={bookData.genre}
                        onChange={handleChange}
                        required
                    />
                </div>

                {list && (
                    <div>
                        <label htmlFor="genre">Book Condition:</label>
                        <select
                            id="bookCondition"
                            name="bookCondition"
                            value={bookData.bookCondition || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Book Condition</option>
                            <option value="new">New</option>
                            <option value="like-new">Like New</option>
                            <option value="good">Good</option>
                            <option value="acceptable">Acceptable</option>
                            <option value="poor">Poor</option>
                        </select>
                    </div>
                )}

                {/* <div>
                    <label htmlFor="coverImage">Cover Image:</label>
                    <input
                        type="file"
                        id="coverImage"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div> */}

                {/* <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={bookData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div> */}

                <button type="submit" className="submit-button">Submit Book</button>
            </form>
        </div>
    );
}
