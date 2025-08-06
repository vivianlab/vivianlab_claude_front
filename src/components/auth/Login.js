import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Link,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validation/authValidation';
import FormField from '../ui/FormField';

/**
 * Login component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Login component
 */
const Login = ({ onSwitchToRegister }) => {
  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Navigate to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Form state management
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    validateForm,
    setGeneralError,
    clearErrors
  } = useForm(
    {
      email: '',
      password: ''
    },
    validateLoginForm
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearErrors();
    clearError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Attempt login
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setGeneralError(result.message);
    }
  };

  // Handle password visibility toggle
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
            Welcome Back
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account to continue
          </Typography>

          {/* Error Alert */}
          {(errors.general || authError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errors.general || authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Email Field */}
            <FormField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              autoComplete="email"
              autoFocus
              startIcon={<Email color="action" />}
            />
            
            {/* Password Field */}
            <FormField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              required
              autoComplete="current-password"
              startIcon={<Lock color="action" />}
              showPasswordToggle
              onPasswordToggle={handlePasswordToggle}
              showPassword={showPassword}
              endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
            />
            
            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            {/* Switch to Register */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToRegister}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 