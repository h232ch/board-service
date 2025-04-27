import React, { useState } from 'react';
import SignUp from '../SignUp/SignUp';
import './Login.css';

// Define the type for our props
interface LoginProps {
  // We'll add props later as needed
  onLogin: (username: string, password: string) => void;
  onSignUp: (username: string, password: string) => void;
}

// Create a functional component with TypeScript
const Login: React.FC<LoginProps> = ({ onLogin, onSignUp }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.username, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (showSignUp) {
    return (
      <SignUp
        onSignUp={(username, password) => {
          onSignUp(username, password);
          setShowSignUp(false);
        }}
        onCancel={() => setShowSignUp(false)}
      />
    );
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <button className="login-button" type="submit">
          Login
        </button>
        
        <div className="signup-prompt">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="signup-link"
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login; 