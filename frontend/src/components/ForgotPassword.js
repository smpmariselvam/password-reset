import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setMessage(null);
    setError(null);
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email.trim(),
      });

      setMessage(response.data.message);
      setEmail(''); // Clear input on success
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-5">
        <Card>
          <Card.Header className="text-center">
            <i className="bi bi-envelope-fill icon-large mb-3 d-block"></i>
            <h4 className="mb-0">Forgot Password?</h4>
            <small className="text-muted">
              Enter your email to receive a reset link
            </small>
          </Card.Header>
          <Card.Body className="p-4">
            {message && (
              <Alert variant="success" className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>
                  <i className="bi bi-person me-1"></i>
                  Email Address
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <InputGroup.Text>
                    <i className="bi bi-at"></i>
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  We'll send a password reset link to this email.
                </Form.Text>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Send Reset Link
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

export default ForgotPassword;