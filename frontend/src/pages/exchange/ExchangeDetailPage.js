import React, { useState, useEffect } from 'react';
import '../../css/ExchangeDetailPage.css'; // Assuming you'll add some custom styling here
import { getExchangeById } from '../../axios/exchange_req';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import PageLayout from '../Template/template'

const ExchangeDetailPage = () => {
  const location = useLocation();
  const { exchangeId } = location.state;
  const { authToken, user } = useAuthContext();

  const [exchangeStatus, setExchangeStatus] = useState('pending'); // Exchange status (e.g., 'pending' or 'completed')
  const [personA, setPersonA] = useState({}); // Details of Person A (initiator)
  const [personB, setPersonB] = useState({}); // Details of Person B (receiver)
  const [booksPersonA, setBooksPersonA] = useState([]); // Book covers for Person A
  const [booksPersonB, setBooksPersonB] = useState([]); // Book covers for Person B
  
  // Re-fetch details if `exchangeId` changes
  useEffect(() => {
    getExchangeDetail();
  }, [exchangeId]);

  // Function to fetch exchange details
  const getExchangeDetail = async () => {
    try {
      const res = await getExchangeById(authToken, exchangeId); // Fetch data from API
      
      // Update state with the fetched data
      setPersonA(res?.exchange?.requesterUserID || {});
      setPersonB(res?.exchange?.ownerUserID || {});
      setBooksPersonA(res?.exchange?.requesterBookID || []);
      setBooksPersonB(res?.exchange?.ownerBookID || []);
      setExchangeStatus(res?.exchange?.status || 'pending'); // Default to 'pending' if no status is provided
    } catch (error) {
      console.error('Failed to fetch exchange details:', error);
    }
  };

  // Handle exchange actions (approve/reject)
  const handleExchangeAction = (action) => {
    console.log(`${action} exchange`);
    // You can add logic here to approve or reject the exchange
  };

  return (
    <PageLayout>
      <div className="exchange-detail-container">
        <h1 className="exchange-title">Exchange Detail</h1>

        <div className="progress-detail">
          <h3>Progress Detail: {exchangeStatus}</h3>

          {/* Person A Details */}
          <div className="person-a">
            <h4>{personA?.username} (Initiated)</h4>
            <div className="book-spot">
              {booksPersonA.length > 0 ? (
                booksPersonA.map((book, index) => (
                  <img 
                    key={index}
                    src={book?.cover || "https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg"} 
                    alt={`Person A's Book ${index + 1}`} 
                    className="book-cover" 
                  />
                ))
              ) : (
                <div className="empty-book-spot">No Books</div>
              )}
            </div>
          </div>

          {/* Person B Details */}
          <div className="person-b">
            <h4>{personB?.username} (Requested)</h4>
            <div className="book-spot">
              {booksPersonB.length > 0 ? (
                booksPersonB.map((book, index) => (
                  <img 
                    key={index}
                    src={book?.cover || "https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg"} 
                    alt={`Person B's Book ${index + 1}`} 
                    className="book-cover" 
                  />
                ))
              ) : (
                <div className="empty-book-spot">No Books</div>
              )}
            </div>
          </div>
        </div>

        {/* Displaying buttons based on the requester or owner */}
        <div>
          {exchangeStatus === 'pending' && personB?.username === user?.username && (
            <>
              <button className="exchange-button" onClick={() => handleExchangeAction('Accept')}>Accept Exchange</button>
              <button className="exchange-button" onClick={() => handleExchangeAction('Reject')}>Reject Exchange</button>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ExchangeDetailPage;
