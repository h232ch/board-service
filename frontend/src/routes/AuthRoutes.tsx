import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Header from '../components/Header/Header';
import { Box } from '@mui/material';

export const AuthRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, user, logout } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate('/board');
    } catch (error: any) {
      console.error('Login failed:', error?.response?.data?.message || error.message);
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await register(username, email, password);
      navigate('/board');
    } catch (error: any) {
      console.error('Registration failed:', error?.response?.data?.message || error.message);
      throw error;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        isLoggedIn={!!user}
        username={user?.username || ''}
        onLogout={logout}
        userInfo={user}
      />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onSubmit={handleLogin} />} />
          <Route path="/register" element={<Register onSubmit={handleRegister} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}; 