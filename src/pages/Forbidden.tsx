import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Forbidden.css';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="forbidden-page">
      <div className="forbidden-content">
        <div className="forbidden-icon"></div>
        <h1>403 - Forbidden</h1>
        <p>You don't have permission to access this page.</p>
        <p className="forbidden-subtitle">
          Please contact your administrator if you believe this is an error.
        </p>

        <div className="forbidden-actions">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/')} className="home-btn">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};
