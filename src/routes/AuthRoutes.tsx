import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login/Login';
import { useAuth } from '../contexts/AuthContext';

export const AuthRoutes: React.FC = () => {
  const { isLoggedIn, login } = useAuth();

  const handleLogin = (username: string, password: string) => {
    const userInfo = {
      id: username,
      loginDate: new Date().toISOString(),
      signupDate: new Date().toISOString()
    };
    login(username, userInfo);
  };

  const handleSignUp = (username: string, password: string) => {
    const userInfo = {
      id: username,
      loginDate: new Date().toISOString(),
      signupDate: new Date().toISOString()
    };
    login(username, userInfo);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={
        <Login 
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}; 