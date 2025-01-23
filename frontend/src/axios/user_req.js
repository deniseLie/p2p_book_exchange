import axios from 'axios';

// Register user
export const registerUser = async (formData) => {
    try {
        console.log(formData);
        const response = await axios.post('http://localhost:5000/users/register', formData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

// Login user
export const loginUser = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/users/login', formData);
        return response.data;
    } catch (error) {
        console.error('Error login user:', error);
        throw error;
    }
}

// Check if email is available
export const checkEmail = async (email) => {
    try {
        const response = await axios.post('http://localhost:5000/users/check-email', { email });
        if (response.data.message === 'Unavailable') {
            return false; //unavailable email
        } else {
            return true; // available email
        }
    } catch (error) {
        console.error('Error Check if email is available:', error);
        throw error;
    }
};


// Send password reset
export const sendPasswordResetEmail = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/users/password-reset', formData);
        return response.data;
    } catch (error) {
        console.error('Error Send password reset user:', error);
    }
}

// Reset password
export const resetPassword = async ({ resetToken, formData }) => {
    try {
        const response = await axios.put(`http://localhost:5000/users/reset-password/${resetToken}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error Reset password user:', error);
    }
}

// Get user profile
export const getUserProfile = async ({ formData }) => {
    try {
        const response = await axios.get('http://localhost:5000/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error Get user profile user:', error);
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