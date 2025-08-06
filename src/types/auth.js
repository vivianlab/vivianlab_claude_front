// Authentication Types
export const AUTH_TYPES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  USER_NOT_ALLOWED: 'USER_NOT_ALLOWED'
};

// Form Data Types
export const FORM_TYPES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER'
};

// User object structure
export const USER_STRUCTURE = {
  id: null,
  email: '',
  createdAt: null,
  updatedAt: null
};

// Form validation error structure
export const ERROR_STRUCTURE = {
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
};

// API Response structure
export const API_RESPONSE_STRUCTURE = {
  success: false,
  data: null,
  error: null,
  message: ''
}; 