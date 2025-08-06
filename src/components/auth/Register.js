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
import { validateRegisterForm } from '../../utils/validation/authValidation';
import FormField from '../ui/FormField';

/**
 * Register component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Register component
 */
const Register = ({ onSwitchToLogin }) => {
  const { register, error: authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    clearErrors,
    resetForm
  } = useForm(
    {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validateRegisterForm
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

    // Attempt registration
    const result = await register(formData.email, formData.password);
    
    if (result.success) {
      // Reset form on successful registration
      resetForm();
      // Optionally switch to login page
      // onSwitchToLogin();
    } else {
      setGeneralError(result.message);
    }
  };

  // Handle password visibility toggle
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // Handle confirm password visibility toggle
  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Create Account
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join us and start managing your system
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
              autoComplete="new-password"
              startIcon={<Lock color="action" />}
              showPasswordToggle
              onPasswordToggle={handlePasswordToggle}
              showPassword={showPassword}
              endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
            />
            
            {/* Confirm Password Field */}
            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              startIcon={<Lock color="action" />}
              showPasswordToggle
              onPasswordToggle={handleConfirmPasswordToggle}
              showPassword={showConfirmPassword}
              endIcon={showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            />
            
            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            {/* Switch to Login */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToLogin}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 