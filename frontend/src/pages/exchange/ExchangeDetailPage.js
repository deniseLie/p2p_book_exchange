import React, { useState, useEffect } from 'react';
import '../../css/ExchangeDetailPage.css'; // Assuming you'll add some custom styling here
import { getExchangeById, updateExchangeStatus, updateRequesterBookID } from '../../axios/exchange_req';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import PageLayout from '../Template/template';
import { getAvailableBooksByUserId } from '../../axios/book_req';
import { camelCaseToReadable } from '../../functions/textFunction'

const ExchangeDetailPage = () => {
  const location = useLocation();
  const { exchangeId } = location.state;
  const { authToken, userId } = useAuthContext();

  const [exchangeStatus, setExchangeStatus] = useState('pending');
  const [personA, setPersonA] = useState({});
  const [personB, setPersonB] = useState({});
  const [booksPersonA, setBooksPersonA] = useState([]);
  const [booksPersonB, setBooksPersonB] = useState([]);
  const [personABookList, setPersonABookList] = useState([]); // Store the books fetched from the API
  const [selectedBookPersonA, setSelectedBookPersonA] = useState(null); // Track selected book from Person A

  useEffect(() => {
    getExchangeDetail();
  }, [exchangeId]);

  const getExchangeDetail = async () => {
    try {
      const res = await getExchangeById(authToken, exchangeId);
      console.log('getExchangeDetail', res);

      setPersonA(res?.exchange?.requesterUserID || {});
      setPersonB(res?.exchange?.ownerUserID || {});
      setBooksPersonA(res?.exchange?.requesterBookID || []);
      setBooksPersonB(res?.exchange?.ownerBookID || []);
      setExchangeStatus(res?.exchange?.status || 'pending');

      // If no books available for Person A, fetch their book list
      if (res?.exchange?.requesterUserID && res?.exchange?.requesterUserID._id) {
        fetchPersonABookList(res?.exchange?.requesterUserID._id);
      }
    } catch (error) {
      console.error('Failed to fetch exchange details:', error);
    }
  };

  // Function to fetch Person A's book list
  const fetchPersonABookList = async (userId) => {
    try {
      const response = await getAvailableBooksByUserId(authToken, userId);
      setPersonABookList(response || []);
    } catch (error) {
      console.error('Failed to fetch books for Person A:', error);
    }
  };

  // Handle Action 
  const handleExchangeAction = async (action) => {
    try {

        updateBookPersonA();
      let status;
      
      console.log('action', action, 'exchangeStatus', exchangeStatus)
      // Determine the status based on the current exchange status and action
      if (action === 'Accept') {
        if (exchangeStatus === 'pending') {
          status = 'halfApproved'; // Update to 'halfApproved' if exchange is in progress
        } else if (exchangeStatus === 'halfApproved') {
          status = 'completed'; // Update to 'completed' if exchange is already halfApproved

          if (userId === personB?._id) {
            updateBookPersonA();
            selectedBookPersonA = null;
          }
        } else {
          console.error('Cannot accept, invalid status for action.');
          return;
        }
      } else if (action === 'Denied' || action === 'Cancel') {
        status = action.toLowerCase(); // Convert action to lowercase ('denied' or 'cancel')
      } else {
        console.error('Invalid action');
        return;
      }

      // Ensure the status is valid before making the request
      if (!['pending', 'denied', 'inprogress', 'halfApproved', 'canceled', 'completed'].includes(status)) {
        console.error('Invalid status:', status);
        return;
      }
      console.log(status)
  
      // Make the request to the backend to update the exchange status
      const response = await updateExchangeStatus(authToken, exchangeId, status);
      console.log(response);
      alert("Successful")
      
      // Call function to update exchange Book A
      if (action == 'Accept' && userId === personB?._id) {
        console.log('updateBookPersonA')
        updateBookPersonA();
      } 
    } catch (err) {
      console.error('Failed to update exchange status:', err);
      // Handle error (e.g., show error message)
    }

    
  };
  
  const updateBookPersonA = async () => {
    try {
      const res = await 6(exchangeId, selectedBookPersonA?.id);
      console.log('updateBookPersonA', res);

    } catch (error) {
      console.error('Failed to update requester book ID:', error);
    }
  };

  
  
  const handleBookSelectedByPersonA = (book = null) => {
    if (!book) {
      setSelectedBookPersonA(null);
      return;
    }

    // Update the selected book for Person A (when Person A allows a book to be selected)
    setSelectedBookPersonA(book);
  };

  return (
    <PageLayout>
      <div className="exchange-detail-container">
        <h1 className="exchange-title">Exchange Detail</h1>
        <button className="exchange-red-button" onClick={() => handleExchangeAction('denied')}>Not interested</button>

        <div className="progress-detail">
          <h3>Progress Detail: {camelCaseToReadable(exchangeStatus)}</h3>

          <div className="persons">
            {/* Person A Details */}
            <div className="person-a">
              <h4>{personA?.username} (Initiated)</h4>
              <div className="book-spot">
                {/* If a book is selected by Person A, show the selected book */}
                {selectedBookPersonA ? (
                  <div onClick={() => handleBookSelectedByPersonA()}>
                    <img
                      src={selectedBookPersonA?.cover || "https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg"}
                      alt={selectedBookPersonA?.title}
                      className="book-cover"
                    />
                    <p>{selectedBookPersonA?.title}</p>
                  </div>
                ) : (
                  // If no book is selected, show the list of books Person A has
                  <>
                    {booksPersonA.length > 0 ? (
                      booksPersonA.map((book, index) => (
                        <img
                          key={index}
                          src={book?.cover || "https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg"}
                          alt={`${personA?.username}'s Book ${index + 1}`}
                          className="book-cover"
                          onClick={() => handleBookSelectedByPersonA(book)} // Handle selecting a book
                        />
                      ))
                    ) : (
                      <div className="empty-book-spot">
                        <p>No Books</p>
                        {personABookList?.length === 0 && <p>No books available for {personA?.username}</p>}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* If no book is selected, allow Person A to choose a book */}
              {personABookList.length > 0 && !selectedBookPersonA && (
                <>
                  <p className="chooseBook">Choose one of these books:</p>
                  <div className="book-list">
                    {personABookList.map((book, index) => (
                      <div key={index} onClick={() => handleBookSelectedByPersonA(book)} className="book-cover-wrapper">
                        <img
                          src={book?.cover || "https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg"}
                          alt={book?.title}
                          className="book-cover-image"
                        />
                        <p className="book-title">{book?.title}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>


            {/* Person B Details */}
            <div className="person-b">
              <h4>{personB?.username} (counterpart)</h4>
              <div className="book-spot">
                {booksPersonB.length > 0 ? (
                  booksPersonB.map((book, index) => (
                    <div key={index}>
                      <img
                        src={"https://templates.mediamodifier.com/5db698f47c3dc9731647a4e9/fiction-novel-book-cover-template.jpg"}
                        alt={`Person B's Book ${index + 1}`}
                        className="book-cover"
                      />
                      <p>{book?.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty-book-spot">No Books</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conditional rendering for buttons */}
        <div>
          {/* {exchangeStatus === 'pending' && !booksPersonB && (
            <button className="choose-book-button">Choose Book</button>
          )} */}

          {(booksPersonA?.length > 0 || selectedBookPersonA) && booksPersonB?.length > 0 && (
            <div className='exchangeButtons'>
              <button className="exchange-green-button" onClick={() => handleExchangeAction('Accept')}>Accept Exchange</button>
              <button className="exchange-red-button" onClick={() => handleExchangeAction('Cancel')}>Cancel Exchange</button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ExchangeDetailPage;
