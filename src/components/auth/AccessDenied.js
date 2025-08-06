import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Button,
  Container
} from '@mui/material';
import {
  Block as BlockIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AccessDenied = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 500,
            width: '100%'
          }}
        >
          <BlockIcon
            sx={{
              fontSize: 64,
              color: 'error.main',
              mb: 2
            }}
          />
          
          <Typography variant="h4" gutterBottom color="error.main">
            Access Denied
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your account is not allowed to access this system.
          </Typography>

          {user && (
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Account Details:</strong><br />
                Email: {user.email}<br />
                Status: {user.isAllowed ? 'Allowed' : 'Not Allowed'}<br />
                Admin: {user.isAdmin ? 'Yes' : 'No'}
              </Typography>
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please contact a system administrator to request access to this system.
          </Typography>

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default AccessDenied; 