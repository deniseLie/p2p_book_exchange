import axios from 'axios';

// Get book search
export const getBookSearch = async (token, query) => {
    try {
        const response = await axios.get(`http://localhost:5000/books/search?query=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Get user profile user:', error);
    }
}

// Add a book
export const addABook = async (token, formData) => {
    try {
        const response = await axios.post(`http://localhost:5000/books`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        console.log('get book', response?.data)
        return response.data;
    } catch (error) {
        console.error('Error Add a book:', error, error?.message);
    }
}

// Get available books by user id 
export const getAvailableBooksByUserId = async (token, userId) => {
    try {
        const response = await axios.get(`http://localhost:5000/userBooks/available/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Get available books by user id:', error);
    }
}
