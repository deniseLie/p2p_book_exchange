import axios from 'axios';

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
