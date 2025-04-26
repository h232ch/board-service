import React from 'react';
import './Header.css';

// Define the type for our props
interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

// Create a functional component with TypeScript
const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Board Service</h1>
        {isLoggedIn && (
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header; 