import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthContainer from './components/auth/AuthContainer';
import AccessDenied from './components/auth/AccessDenied';
import GlobalLayout from './components/layout/GlobalLayout';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/user/Users';
import PDF from './components/pdf/PDF';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // If user exists but is not allowed, show access denied page
  if (user && !isAuthenticated && error && error.includes('not allowed')) {
    return <AccessDenied />;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute>
          <AuthContainer />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <GlobalLayout>
            <Dashboard />
          </GlobalLayout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <GlobalLayout>
            <Users />
          </GlobalLayout>
        </ProtectedRoute>
      } />
      <Route path="/pdf" element={
        <ProtectedRoute>
          <GlobalLayout>
            <PDF />
          </GlobalLayout>
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

function App() {
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
}

export default App;
