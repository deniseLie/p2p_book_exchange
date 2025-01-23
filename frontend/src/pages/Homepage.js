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
          <img src="https://via.placeholder.com/400x500" alt="Book Exchange" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
