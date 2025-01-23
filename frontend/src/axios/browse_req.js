import axios from 'axios';

// Browse unlisted book by user id 
export const getUnlistedBookByUserId = async (token, query) => {
    try {
        const response = await axios.get(`http://localhost:5000/browse/unlistedBookByUserId?query=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Get user profile user:', error);
    }
}

// browse all user book
export const browseUserBooks = async (token, query) => {
    try {
        const response = await axios.get(`http://localhost:5000/browse/userbooks?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Get user profile user:', error);
    }
}
