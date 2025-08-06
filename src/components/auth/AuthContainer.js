import React, { useState } from 'react';
import { Box } from '@mui/material';
import Login from './Login';
import Register from './Register';

/**
 * Authentication container component
 * Manages switching between login and register forms
 * @returns {JSX.Element} AuthContainer component
 */
const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      {isLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      )}
    </Box>
  );
};

export default AuthContainer; 