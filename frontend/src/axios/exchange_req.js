import axios from 'axios';

// create exchange req
export const createExchangeRequest = async (token, exchangeData) => {
    try {
        const response = await axios.post('http://localhost:5000/exchanges/create', exchangeData, {
            headers: {
                Authorization: `Bearer ${token}`, // Assuming you're using token-based authentication
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating exchange request:', error.response?.data || error.message);
        throw error;
    }
};

// Get all exchanges by UserId
export const getAllExchangesByUserId = async (token, userId) => {
    try {
        const response = await axios.get(`http://localhost:5000/exchanges/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Assuming you're using token-based authentication
                'Content-Type': 'application/json',
            },
        });
        console.log(userId, response.data)
        return response.data;
    } catch (error) {
        console.error('Error Get exchange by user id:', error.response?.data || error.message);
        throw error;
    }
};


// Get exchange by id
export const getExchangeById = async (token, exchangeId) => {
    try {
        const response = await axios.get(`http://localhost:5000/exchanges/id/${exchangeId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Assuming you're using token-based authentication
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Get exchange by id:', error.response?.data || error.message);
        throw error;
    }
};

// Get all pending exchanges where the user is the book owner (requests from others)
export const getPendingExchangesByUserId = async (token) => {
    try {
        const response = await axios.get(`http://localhost:5000/exchanges/pending`, {
            headers: {
                Authorization: `Bearer ${token}`, // Assuming you're using token-based authentication
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching pending exchanges by user id:', error.response?.data || error.message);
        throw error;
    }
};

export const updateExchangeStatus = async (authToken, exchangeID, status) => {
    try {
        // Prepare the request body
        const requestBody = {
            exchangeID,
            status,
        };
        console.log('/', status)

        // Make the API request
        const response = await axios.put('http://localhost:5000/exchanges/update', requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include the auth token if necessary
                },
            }
        );

        // Handle the response
        console.log('Exchange status updated successfully:', response.data);
        return response.data;
    } catch (error) {
        // Handle errors
        if (error.response) {
            // If the server responded with an error status
            console.error('Error:', error.response.data.message);
        } else {
            // If there was no response from the server
            console.error('Error:', error.message);
        }
        throw error; // Optionally throw error to propagate it for further handling
    }
};

// Function to update the requester book ID
export const updateRequesterBookID = async (exchangeID, requesterBookID) => {
    try {
      const response = await axios.put('/api/exchange/updateRequesterBookID', {
        exchangeID,
        requesterBookID,
      });
  
      if (response.status === 200) {
        console.log('Requester Book ID updated successfully', response.data);
      }
    } catch (error) {
      console.error('Error updating requester book ID', error.response?.data || error.message);
    }
  };