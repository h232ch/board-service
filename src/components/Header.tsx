import React from 'react';
import './Header.css';

// Define the type for our props
interface HeaderProps {
  title: string;
  children?: React.ReactNode;  // Optional children prop
}

// Create a functional component with TypeScript
const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      {children && <div className="header-subtitle">{children}</div>}
    </header>
  );
};

export default Header; 