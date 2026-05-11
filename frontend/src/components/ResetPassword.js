import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/verify-token/${token}`);
        setTokenValid(true);
        setVerifying(false);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Invalid or expired token';
        setError(errorMsg);
        setTokenValid(false);
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('No reset token provided');
      setVerifying(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setMessage(null);
    setError(null);

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });

      setMessage(response.data.message);

      // Clear form
      setPassword('');
      setConfirmPassword('');

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while verifying token
  if (verifying) {
    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5 text-center">
          <Card className="p-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Verifying reset link...</h5>
          </Card>
        </div>
      </div>
    );
  }

  // Show error if token is invalid/expired
  if (!tokenValid) {
    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <Card>
            <Card.Body className="p-5 text-center">
              <i className="bi bi-x-circle-fill text-danger icon-large mb-3 d-block"></i>
              <h4 className="text-danger">Link Expired or Invalid</h4>
              <p className="text-muted">{error}</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="mt-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Forgot Password
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-5">
        <Card>
          <Card.Header className="text-center">
            <i className="bi bi-key-fill icon-large mb-3 d-block"></i>
            <h4 className="mb-0">Reset Password</h4>
            <small className="text-muted">
              Enter your new password below
            </small>
          </Card.Header>
          <Card.Body className="p-4">
            {message && (
              <Alert variant="success" className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
                <div className="w-100 mt-2">
                  <small>Redirecting to login page...</small>
                </div>
              </Alert>
            )}

            {error && !message && (
              <Alert variant="danger" className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-lock me-1"></i>
                  New Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || !!message}
                    minLength={6}
                  />
                  <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  Minimum 6 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <i className="bi bi-lock-fill me-1"></i>
                  Confirm Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading || !!message}
                  />
                  <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading || !!message}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Reset Password
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;