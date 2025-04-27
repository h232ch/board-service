import React from 'react';
import './Header.css';

// Define the type for our props
interface HeaderProps {
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

// Create a functional component with TypeScript
const Header: React.FC<HeaderProps> = ({ isLoggedIn, username, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Board Service</h1>
        {isLoggedIn && (
          <div className="user-info">
            <span>Nice to meet you, {username}</span>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 