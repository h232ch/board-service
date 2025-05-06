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
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
}

const Register: React.FC<RegisterProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await onSubmit(formData.username, formData.email, formData.password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Please fill in your details to register
        </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
          <TextField
            fullWidth
            label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
            required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
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
                autoComplete="new-password"
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
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
            required
                autoComplete="new-password"
                error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                helperText={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                Sign Up
          </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" component="span" color="text.secondary">
              Already have an account?{' '}
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    cursor: 'pointer',
                    color: '#2C3E50',
                    fontWeight: 600,
                    '&:hover': {
                      color: '#34495E',
                    }
                  }}
                >
                  Sign In
              </Link>
              </Box>
            </Stack>
          </Box>
        </Box>
    </Box>
    </Container>
  );
};

export default Register; 