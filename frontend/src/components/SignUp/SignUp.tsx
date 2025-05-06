import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Stack
} from '@mui/material';

interface SignUpProps {
  onSignUp: (username: string, password: string) => void;
  onCancel: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: ''
    };

    // Username validation
    if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters long';
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSignUp(formData.username, formData.password);
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
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                onClick={onCancel}
                fullWidth
              >
            Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp; 