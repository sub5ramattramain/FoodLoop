import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';

import Profile from './pages/Profile';

import { useAppAuth } from './hooks/useAppAuth';

function App() {
  const { isUserLoggedIn, isLoading, error } = useAppAuth();

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={isUserLoggedIn ? <Home /> : <LandingPage />} />///cazul in care clientul e logat va fi trimis la dashboard

        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={isUserLoggedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;