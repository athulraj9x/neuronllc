import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../types';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    const items = [
      { path: '/dashboard', label: 'Dashboard', icon: '' }
    ];

    if (permissions?.canAdd) {
      items.push({ path: '/create-user', label: 'Create Profile', icon: '' });
    }

    if (permissions?.canView) {
      items.push({ path: '/users', label: 'Users List', icon: '' });
    }

    if (user?.role === 'associate') {
      items.push({ path: '/my-profile', label: 'My Profile', icon: '' });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon"></span>
            <span className="brand-text">User Management</span>
          </Link>
        </div>

        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-role">{user?.role}</span>
            <span className="user-name">{user?.fullName}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">

            </span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
