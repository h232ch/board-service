import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import theme from './theme';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import { AuthRoutes } from './routes/AuthRoutes';
import { BoardRoutes } from './routes/BoardRoutes';

const AppContent: React.FC = () => {
  const { isLoggedIn, username, userInfo, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header 
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={logout}
        userInfo={userInfo}
      />
      <Container maxWidth={false} sx={{ maxWidth: 800, width: '100%', mx: 'auto', py: 4 }}>
        <Routes>
          <Route path="/*" element={isLoggedIn ? <BoardRoutes /> : <AuthRoutes />} />
        </Routes>
      </Container>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <BoardProvider>
            <AppContent />
          </BoardProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
