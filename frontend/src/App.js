import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import LoginRegPage from './pages/auth/AuthFlow';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/profile/ProfilePage';
import BrowseUserBooks from './pages/browse/Browsepage';
import ExchangeDetailPage from './pages/exchange/ExchangeDetailPage';
import ExchangesListPage from './pages/exchange/ExchangesListPage';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginRegPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/browse" element={<BrowseUserBooks />} />
        <Route path="/exchanges" element={<ExchangesListPage />} />
        <Route path="/exchangeDetail" element={<ExchangeDetailPage />} />
      </Routes>
    </Router>
  </AuthProvider> 
);

export default App;
