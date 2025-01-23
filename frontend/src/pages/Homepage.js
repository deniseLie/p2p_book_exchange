import React from 'react';
import '../css/Homepage.css';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <div>
      <Header />
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the Joy of Book...</h1>
          <p>Welcome to our book exchange platform, where bibliophiles can find their next literary treasure.</p>
          <a href="#" className="button">Join Now</a>
        </div>
        <div className="hero-image">
          <img src="https://png.pngtree.com/png-clipart/20220320/original/pngtree-pile-of-books-3d-icon-education-and-student-concept-png-image_7457105.png" alt="Book Exchange" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
