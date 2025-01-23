import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import LoginRegPage from './pages/auth/AuthFlow';
import { AuthProvider } from './context/AuthContext';
// import AddBook from './pages/AddBook';
// import Profile from './pages/Profile';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginRegPage />} />
      </Routes>
    </Router>
  </AuthProvider> 
);

export default App;
