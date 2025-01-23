import axios from 'axios';

const fetchBooks = async () => {
    const response = await axios.get('http://localhost:5000/books');
    return response.data;
}

export { fetchBooks }