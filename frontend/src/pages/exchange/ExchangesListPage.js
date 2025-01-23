import React, { useState, useEffect } from 'react';
import { getAllExchangesByUserId } from '../../axios/exchange_req'; // API call
import { useAuthContext } from '../../context/AuthContext'; // To get the auth token and user info
import { useNavigate } from 'react-router-dom'; // To navigate to the ExchangeDetailPage
import '../../css/ExchangesListPage.css';
import PageLayout from '../Template/template';

const ExchangesListPage = () => {
    const { authToken, userId } = useAuthContext(); // Get auth token and user data
    const [exchanges, setExchanges] = useState([]); // State to store exchanges
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    
    const navigate = useNavigate();

    // Fetch exchanges on component mount
    useEffect(() => {
        const fetchExchanges = async () => {
        try {
            const data = await getAllExchangesByUserId(authToken, userId); // Fetch data from API
            setExchanges(data?.exchanges || []); // Set exchanges data
            console.log(data)
        } catch (error) {
            setError('Failed to load exchanges'); // Set error message
        } finally {
            setLoading(false); // Set loading to false once data is fetched
        }
        };

        fetchExchanges(); // Call the fetch function
    }, [authToken, userId]); // Dependencies: authToken and userId

    // If loading, show a loading message
    if (loading) {
        return <div>Loading exchanges...</div>;
    }

    // If there was an error fetching exchanges
    if (error) {
        return <div>{error}</div>;
    }

    // view detail
    const viewDetails = (exchangeId) => {
        navigate('/exchangeDetail', { state: { exchangeId: exchangeId} });
    };

    // Helper function to display status
    const renderStatus = (status) => {
        switch (status) {
            case 'pending':
                return <span className="status pending">Pending</span>;
            case 'approved':
                return <span className="status approved">Approved</span>;
            case 'rejected':
                return <span className="status rejected">Rejected</span>;
            case 'completed':
                return <span className="status completed">Completed</span>;
            default:
                return <span className="status unknown">Unknown</span>;
        }
    };

    return (
        <PageLayout>
            <div className="exchanges-list-container">
            <h1>Your Exchanges</h1>

            {exchanges.length === 0 ? (
                <p>No exchanges found.</p>
            ) : (
                <div className="exchanges-list">
                {exchanges.map((exchange) => (
                    <div key={exchange._id} className="exchange-item">
                        <div className="exchange-info">
                            <h3>Exchange with {exchange.ownerUserID.username}</h3>

                            {/* Display status */}
                            <p>Status: {renderStatus(exchange.status)}</p>


                            <div className="book-info">
                            <h4>Books:</h4>

                            {/* My book they interested in */}
                            {exchange.requesterBookID?.length > 0 && (
                                <>
                                    <h5>My book</h5>
                                    <ul>
                                        {exchange.requesterBookID.map((book, index) => (
                                        <li key={index}>{book.title}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {/* Book im interested in */}
                            <h5>{exchange?.ownerUserID?.username} book</h5>
                            <ul>
                                {exchange.ownerBookID.map((book, index) => (
                                <li key={index}>{book.title}</li>
                                ))}
                            </ul>

                            </div>
                            <button onClick={() => viewDetails(exchange._id)}>View Details</button>
                        </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </PageLayout>
    );
};

export default ExchangesListPage;
