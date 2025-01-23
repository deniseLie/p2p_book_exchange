import React from 'react';
import '../css/Homepage.css';
import Header from '../components/Header';
import { useAuthContext } from '../context/AuthContext';

const HomePage = () => {

  const { authToken } = useAuthContext();

  // button on click
  const buttonOnClick = () => {
      authToken ? window.location.href = '/browse' : window.location.href = '/auth';
  }

  return (
    <div>
      <Header />
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the Joy of Book...</h1>
          <p>Welcome to our book exchange platform, where bibliophiles can find their next literary treasure.</p>

          
          <button className="button" onClick={buttonOnClick}>
            {authToken ? 'Browse Books' : 'Sign Up'}
          </button>
        </div>
        <div className="hero-image">
          <img src="https://png.pngtree.com/png-clipart/20220320/original/pngtree-pile-of-books-3d-icon-education-and-student-concept-png-image_7457105.png" alt="Book Exchange" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
