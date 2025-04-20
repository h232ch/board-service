import React from 'react';
import './Header.css';

// Define the type for our props
interface HeaderProps {
  title: string;
}

// Create a functional component with TypeScript
const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header; 