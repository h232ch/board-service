import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import AuthRoutes from './routes/AuthRoutes';
import { BoardRoutes } from './routes/BoardRoutes';
import { useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* 인증된 사용자가 /login이나 /register에 접근하면 /board로 리다이렉션 */}
        {user && (
          <>
            <Route path="/login" element={<Navigate to="/board" replace />} />
            <Route path="/register" element={<Navigate to="/board" replace />} />
          </>
        )}
        
        {/* 인증된 사용자는 /board로, 그 외에는 AuthRoutes로 */}
        <Route path="/*" element={user ? <BoardRoutes /> : <AuthRoutes />} />
      </Routes>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
