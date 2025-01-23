import axios from 'axios';

// Get user profile
export const getUserProfile = async (token) => {
    try {
        const response = await axios.get('http://localhost:5000/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Get user profile user:', error?.message);
    }
}

// Update user profile
export const updateUserProfile = async ({ formData }) => {
    try {
        const response = await axios.put('http://localhost:5000/users/profile', formData);
        return response.data;
    } catch (error) {
        console.error('Error Update user profile user:', error);
    }
}

// Get book from user
export const getAllUserBook = async (token) => {
    try {
        const response = await axios.get('http://localhost:5000/userbooks', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Update user profile user:', error);
    }
}

// Add Book to user 
export const addBookToUser = async (token, formData) => {
    try {
        const response = await axios.post('http://localhost:5000/userbooks', formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Add Book to user :', error?.message);
    }
}

