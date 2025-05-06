import React, { useState } from 'react';
import SignUp from '../SignUp/SignUp';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Stack,
  Link
} from '@mui/material';

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
            <TextField
              fullWidth
              label="Password"
              name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
          Login
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" component="span">
                Don't have an account?{' '}
              </Typography>
              <Link
                component="button"
                variant="body2"
            onClick={() => setShowSignUp(true)}
                sx={{ cursor: 'pointer' }}
          >
            Sign Up
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 