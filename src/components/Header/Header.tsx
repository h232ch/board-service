import React, { useState } from 'react';
import { User } from '../../types/User';
import Profile from '../Profile/Profile';
import './Header.css';

// Define the type for our props
interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
  userInfo: User | null;
}

// Create a functional component with TypeScript
const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLogout, userInfo }) => {
  const [showProfile, setShowProfile] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>Board Service</h1>
        {isLoggedIn && userInfo && (
          <div className="user-info">
            <div className="user-details">
              <span>Welcome, {username}</span>
              <span className="user-date">Last login: {formatDate(userInfo.loginDate)}</span>
            </div>
            <button className="profile-button" onClick={() => setShowProfile(true)}>
              Profile
            </button>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
      {showProfile && userInfo && (
        <Profile user={userInfo} onClose={() => setShowProfile(false)} />
      )}
    </header>
  );
};

export default Header; 