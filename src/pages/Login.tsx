import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(credentials);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleDemoLogin = (username: string) => {
    // default password for demo accounts
    setCredentials({ username, password: 'demo123' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>User Management System</h1>
          <p>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Select Any Accounts</h3>
          <p>Click any account to auto-fill credentials:</p>

          <div className="demo-account-buttons">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="demo-btn admin"
            >
              <strong>Admin</strong>
              <span>Full access to all features</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('supervisor')}
              className="demo-btn supervisor"
            >
              <strong>Supervisor</strong>
              <span>Edit & view users only</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('associate')}
              className="demo-btn associate"
            >
              <strong>Associate</strong>
              <span>View users only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
