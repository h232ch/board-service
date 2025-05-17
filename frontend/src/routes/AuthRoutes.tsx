import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Header from '../components/Header/Header';
import { Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AuthRoutes: React.FC = () => {
  const { user, logout } = useAuth();

  if (user) {
    return <Navigate to="/board" replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        isLoggedIn={false}
        username=""
        onLogout={logout}
        userInfo={null}
      />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AuthRoutes; 