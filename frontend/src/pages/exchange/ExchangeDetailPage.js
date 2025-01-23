import React, { useState, useEffect } from 'react';
import '../../css/ExchangeDetailPage.css'; // Assuming you'll add some custom styling here

const ExchangeDetailPage = ({ exchangeData }) => {
  const [exchangeStatus, setExchangeStatus] = useState('pending'); // You can get the status from the API or props
  const [personA, setPersonA] = useState({}); // Person A's details (initiate request)
  const [personB, setPersonB] = useState({}); // Person B's details (requested)
  const [bookCoverA, setBookCoverA] = useState(null); // Book cover for Person A (initiated)
  const [bookCoverB, setBookCoverB] = useState(null); // Book cover for Person B (requested)

  useEffect(() => {
    // Assuming exchangeData is passed as props with the relevant info for Person A, Person B, and books
    setPersonA(exchangeData.personA);
    setPersonB(exchangeData.personB);
    setBookCoverA(exchangeData.personABookCover);
    setBookCoverB(exchangeData.personBBookCover);
    setExchangeStatus(exchangeData.status); // Can be 'pending' or 'completed'
  }, [exchangeData]);

  return (
    <div className="exchange-detail-container">
      <h1 className="exchange-title">Exchange Detail</h1>

      <div className="progress-detail">
        <h3>Progress Detail: {exchangeStatus}</h3>

        <div className="person-a">
          <h4>Person A (Initiated)</h4>
          <div className="book-spot">
            {bookCoverA ? (
              <img src={bookCoverA} alt="Person A's Book" className="book-cover" />
            ) : (
              <div className="empty-book-spot">No Book</div>
            )}
          </div>
          <p>{personA.name}</p>
        </div>

        <div className="person-b">
          <h4>Person B (Requested)</h4>
          <div className="book-spot">
            {bookCoverB ? (
              <img src={bookCoverB} alt="Person B's Requested Book" className="book-cover" />
            ) : (
              <div className="empty-book-spot">No Book</div>
            )}
          </div>
          <p>{personB.name}</p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDetailPage;
