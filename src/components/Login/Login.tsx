import React from 'react';
import './Login.css';

// Define the type for our props
interface LoginProps {
  // We'll add props later as needed
  onLogin: (username: string, password: string) => void;
}

// Create a functional component with TypeScript
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    onLogin(username, password);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login; 