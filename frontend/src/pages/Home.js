import React, { useState, useEffect } from "react";
import { fetchBooks } from "../backend_call/fetch_data";

const Home = () => {
    const [books, setBooks] = useState([]);
  
    useEffect(() => {
      fetchBooks().then(setBooks);
    }, []);
  
    return (
      <div>
        <h1>Available Books</h1>
        {books.map(book => (
          <div key={book._id}>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    );
};
  
export default Home;