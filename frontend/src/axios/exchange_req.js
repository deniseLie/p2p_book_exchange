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
        const response = await axios.get(`http://localhost:5000/exchanges/${exchangeId}`, {
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
