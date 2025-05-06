import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack,
  Link,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData.email, formData.password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
      display: 'flex', 
      justifyContent: 'center', 
          alignItems: 'center',
      minHeight: '100vh',
          py: 4,
          px: { xs: 2, sm: 0 }
        }}
      >
        <Box 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
        width: '100%', 
            borderRadius: { xs: 0, sm: 2 },
            bgcolor: 'background.paper',
            boxShadow: { xs: 'none', sm: '0 8px 32px rgba(0,0,0,0.1)' }
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: '#2C3E50',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Please sign in to continue
        </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
          <TextField
            fullWidth
            label="Email"
                name="email"
            type="email"
                value={formData.email}
                onChange={handleChange}
            required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
          />
          <TextField
            fullWidth
            label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
            required
            autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
          />
          {error && (
                <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
                variant="contained"
            fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  bgcolor: '#2C3E50',
                  '&:hover': {
                    bgcolor: '#34495E',
                  }
                }}
          >
                Sign In
          </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" component="span" color="text.secondary">
              Don't have an account?{' '}
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    cursor: 'pointer',
                    color: '#2C3E50',
                    fontWeight: 600,
                    '&:hover': {
                      color: '#34495E',
                    }
                  }}
                >
                  Sign Up
              </Link>
              </Box>
            </Stack>
          </Box>
        </Box>
    </Box>
    </Container>
  );
};

export default Login; 