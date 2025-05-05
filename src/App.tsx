import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import theme from './theme';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
        {isLoggedIn ? <BoardRoutes /> : <AuthRoutes />}
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
