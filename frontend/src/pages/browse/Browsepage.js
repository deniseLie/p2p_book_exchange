import React, { useState, useEffect } from 'react';
import PageLayout from '../Template/template';
import { useAuthContext } from '../../context/AuthContext';
import { browseUserBooks } from '../../axios/browse_req';
import '../../css/BrowsePage.css';
import { useNavigate } from 'react-router-dom';
import { createExchangeRequest } from '../../axios/exchange_req';

const BrowseUserBooks = () => {
    // State variables for the data, filters, and pagination
    const [userBooks, setUserBooks] = useState([]);
    const [filters, setFilters] = useState({
        title: '',
        author: '',
        genre: '',
        bookCondition: '',
        bookStatus: '',
        username: '',
        email: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUserBooks: 0,
        limit: 10
    });
    const [loading, setLoading] = useState(false);

    const { authToken } = useAuthContext();
    const navigate = useNavigate();

    // Function to fetch user books from the API
    const fetchUserBooks = async (page = 1) => {
        try {
            setLoading(true);
            
            // Construct the query string from the filters
            const queryParams = new URLSearchParams({
                ...filters, // Include filters like title, author, genre, etc.
                page: page.toString(), // Current page
                limit: pagination.limit.toString(), // Items per page
            }).toString();
            
            // Call the API with the query parameters and authorization token
            const response = await browseUserBooks(authToken, queryParams);
         
            setUserBooks(response.userBooks);
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                totalUserBooks: response.pagination.totalUserBooks,
                limit: pagination.limit
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user books:', error);
            setLoading(false);
        }
    };

    // Fetch user books whenever filters or pagination change
    useEffect(() => {
        fetchUserBooks(pagination.currentPage);
    }, [filters, pagination.currentPage]);

    // Handle filter input changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Handle pagination button clicks
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                currentPage: newPage,
            }));
            fetchUserBooks(newPage);  // Fetch user books with the updated page
        }
    };

    // Handle book on click
    const bookOnClick = (userBook) => {
        // navigate('/')
    }

    // Request Exchange
    const requestExchange = async (book) => {
        
        const exchangeData = {
            ownerUserID: book?.userId?._id,
            ownerBookID: [book?.bookId?._id]
        };
        // console.log(exchangeData);

        try {
            const result = await createExchangeRequest(authToken, exchangeData);
            alert('Exchange request created successfully!');
            console.log(result);
            
            // navigate
            navigate('/exchangeDetail', { state: { exchangeId: result?.exchange?._id } });
        } catch (error) {
            alert('Failed to create exchange request');
            console.log('request exchange failed', error)
        }

    }
    

    return (
        <PageLayout>
            <h1>Browse User Books</h1>

            {/* Filters */}
            <div className="filters">
                <input
                    type="text"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    placeholder="Title"
                />
                <input
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    placeholder="Author"
                />
                <input
                    type="text"
                    name="genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                    placeholder="Genre"
                />
                <select
                    id="bookCondition"
                    name="bookCondition"
                    value={filters.bookCondition || ""}
                    onChange={handleFilterChange}
                >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="acceptable">Acceptable</option>
                    <option value="poor">Poor</option>
                </select>
                <select
                    name="bookStatus"
                    value={filters.bookStatus}
                    onChange={handleFilterChange}
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="exchanged">Exchanged</option>
                    <option value="review">Review</option>
                </select>
            </div>

            {/* Book List */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {userBooks?.map((userBook) => (
                        <li key={userBook?._id} onClick={bookOnClick}>
                            <div>
                                <strong>Title:</strong> {userBook?.bookId?.title}
                            </div>
                            <div>
                                <strong>Author:</strong> {userBook?.bookId?.author}
                            </div>
                            <div>
                                <strong>Genre:</strong> {userBook?.bookId?.genre}
                            </div>
                            <div>
                                <strong>Condition:</strong> {userBook?.bookCondition}
                            </div>
                            <div>
                                <strong>Status:</strong> {userBook?.bookStatus}
                            </div>
                            <div>
                                <strong>User:</strong> {userBook?.userId.username}
                            </div>

                            <button onClick={() => requestExchange(userBook)}>Request Exchange</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    Next
                </button>
            </div>
        </PageLayout>
    );
};

export default BrowseUserBooks;
