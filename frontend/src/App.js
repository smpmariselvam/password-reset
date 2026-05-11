import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-primary">
              <i className="bi bi-shield-lock-fill me-2"></i>
              Password Reset
            </h1>
            <p className="text-muted">Secure password recovery system</p>
          </div>

          <Routes>
            <Route path="/" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;