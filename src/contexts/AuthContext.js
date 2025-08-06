import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import { AUTH_TYPES } from '../types/auth';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload && action.payload.isAllowed === true,
        isLoading: false,
        error: null
      };
      
    case AUTH_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case AUTH_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case AUTH_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AUTH_TYPES.LOGOUT:
      return {
        ...initialState,
        isAuthenticated: false,
        isLoading: false
      };
      
    case AUTH_TYPES.USER_NOT_ALLOWED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: false,
        isLoading: false,
        error: 'Your account is not allowed to access this system. Please contact an administrator.'
      };
      
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUserData();
        
        if (token && user) {
           // Check if token is still valid by making a test API call
           try {
             // Try to get user profile to validate token
             const profileResult = await authService.getProfile();
             if (profileResult.success) {
               const userData = profileResult.data;
               
               // Check if user is allowed to access the system
               if (userData.isAllowed === true) {
                 dispatch({ type: AUTH_TYPES.SET_USER, payload: userData });
               } else {
                 dispatch({ type: AUTH_TYPES.USER_NOT_ALLOWED, payload: userData });
               }
             } else {
               // Token is invalid, clear auth data
               authService.clearAuthData();
               dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
             }
           } catch (error) {
             // If profile endpoint doesn't exist or fails, use stored user data
             // This is a fallback for when the backend doesn't have a profile endpoint
             if (user && user.email) {
               // Check if user is allowed to access the system
               if (user.isAllowed === true) {
                 dispatch({ type: AUTH_TYPES.SET_USER, payload: user });
               } else {
                 dispatch({ type: AUTH_TYPES.USER_NOT_ALLOWED, payload: user });
               }
             } else {
               // Token is invalid, clear auth data
               authService.clearAuthData();
               dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
             }
           }
         } else {
          dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({ type: AUTH_TYPES.SET_ERROR, payload: 'Failed to initialize authentication' });
        dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      dispatch({ type: AUTH_TYPES.CLEAR_ERROR });

      const result = await authService.login(email, password);

      if (result.success) {
        // Check if user is allowed to access the system
        if (result.data.isAllowed === true) {
          dispatch({ type: AUTH_TYPES.SET_USER, payload: result.data });
          return { success: true, message: result.message };
        } else {
          dispatch({ type: AUTH_TYPES.USER_NOT_ALLOWED, payload: result.data });
          return { success: false, message: 'Your account is not allowed to access this system. Please contact an administrator.' };
        }
      } else {
        dispatch({ type: AUTH_TYPES.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during login';
      dispatch({ type: AUTH_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      dispatch({ type: AUTH_TYPES.CLEAR_ERROR });

      const result = await authService.register(email, password);

      if (result.success) {
        dispatch({ type: AUTH_TYPES.SET_LOADING, payload: false });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: AUTH_TYPES.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during registration';
      dispatch({ type: AUTH_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      
      await authService.logout();
      dispatch({ type: AUTH_TYPES.LOGOUT });
      
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      // Even if logout API fails, clear local state
      dispatch({ type: AUTH_TYPES.LOGOUT });
      return { success: true, message: 'Logout successful' };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_TYPES.SET_LOADING, payload: true });
      dispatch({ type: AUTH_TYPES.CLEAR_ERROR });

      const result = await authService.updateProfile(profileData);

      if (result.success) {
        dispatch({ type: AUTH_TYPES.SET_USER, payload: result.data });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: AUTH_TYPES.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while updating profile';
      dispatch({ type: AUTH_TYPES.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_TYPES.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 