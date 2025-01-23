import React, { useState, useEffect } from 'react';
import { getAllExchangesByUserId, getPendingExchangesByUserId } from '../../axios/exchange_req'; // API calls
import { useAuthContext } from '../../context/AuthContext'; // To get the auth token and user info
import { useNavigate } from 'react-router-dom'; // To navigate to the ExchangeDetailPage
import '../../css/ExchangesListPage.css';
import PageLayout from '../Template/template';

const ExchangesListPage = () => {
    const [exchanges, setExchanges] = useState([]); // State to store exchanges
    const [pendingExchanges, setPendingExchanges] = useState([]); // State to store pending exchanges
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [view, setView] = useState('exchanges'); // State to toggle between exchanges and pending exchanges

    const navigate = useNavigate();
    const { authToken, userId } = useAuthContext(); 

    // Fetch exchanges when the component mounts
    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                const data = await getAllExchangesByUserId(authToken, userId); // Fetch data from API
                setExchanges(data?.exchanges || []); // Set exchanges data
            } catch (error) {
                setError('Failed to load exchanges'); // Set error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchExchanges(); // Call the fetch function
    }, [authToken, userId]); // Dependencies: authToken and userId

    // Fetch pending exchanges
    useEffect(() => {
        const fetchPendingExchanges = async () => {
        try {
            const data = await getPendingExchangesByUserId(authToken, userId); // Fetch pending data from API
            setPendingExchanges(data?.exchanges || []); // Set pending exchanges data
        } catch (error) {
            setError('Failed to load pending exchanges'); // Set error message
        } finally {
            setLoading(false); // Stop loading
        }
        };

        fetchPendingExchanges(); // Call the fetch function
    }, [authToken, userId]); // Dependencies: authToken and userId

    // View details function
    const viewDetails = (exchangeId) => {
        navigate('/exchangeDetail', { state: { exchangeId: exchangeId } });
    };

    return (
        <PageLayout>
            <div className="exchanges-list-container">
                <h1>Your Exchanges</h1>

                {loading && (
                    <div>Loading exchanges...</div>
                )}

                {error && (
                    <div>{error}</div>
                )}

                <div className="toggle-buttons">
                    <button 
                        className={view === 'exchanges' ? 'active' : ''} 
                        onClick={() => setView('exchanges')}
                    >
                        Exchanges
                    </button>
                    <button 
                        className={view === 'pending' ? 'active' : ''} 
                        onClick={() => setView('pending')}
                    >
                        Pending Exchanges
                    </button>
                </div>

                {view === 'exchanges' ? (
                    <div className="exchanges-list">
                        {exchanges.length === 0 ? (
                            <p>No exchanges found.</p>
                        ) : (
                            exchanges.map((exchange) => (
                                <div key={exchange._id} className="exchange-item">
                                    <div className="exchange-info">
                                        <h3>Exchange with {exchange.ownerUserID.username}</h3>
                                        <p>Status: {exchange.status}</p>
                                        <div className="book-info">
                                            <h4>Books:</h4>
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
                            ))
                        )}
                    </div>
                ) : (
                    <div className="pending-exchanges-list">
                        {pendingExchanges.length === 0 ? (
                            <p>No pending exchanges found.</p>
                        ) : (
                            pendingExchanges.map((exchange) => (
                                <div key={exchange._id} className="pending-exchange-item">
                                    <div className="exchange-info">
                                        <h3>Exchange with {exchange.requesterUserID.username}</h3>
                                        <p>Status: Pending</p>
                                        <div className="book-info">
                                            <h4>Books:</h4>
                                            <h5>Requested Book</h5>
                                            <ul>
                                                {exchange.ownerBookID.map((book, index) => (
                                                    <li key={index}>{book.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button onClick={() => viewDetails(exchange._id)}>View Details</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default ExchangesListPage;
