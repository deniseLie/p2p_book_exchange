import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import AddBook from './pages/AddBook';
// import Profile from './pages/Profile';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/add-book" element={<AddBook />} />
      <Route path="/profile" element={<Profile />} /> */}
    </Routes>
  </Router>
);

export default App;
