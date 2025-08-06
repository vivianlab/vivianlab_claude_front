// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 254
  },
  PASSWORD: {
    REQUIRED: true,
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true
  },
  CONFIRM_PASSWORD: {
    REQUIRED: true,
    MATCH_FIELD: 'password'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
    TOO_SHORT: 'Email must be at least 5 characters',
    TOO_LONG: 'Email must be less than 254 characters'
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    TOO_SHORT: 'Password must be at least 6 characters',
    TOO_LONG: 'Password must be less than 128 characters',
    WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Please confirm your password',
    MISMATCH: 'Passwords do not match'
  },
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User with this email already exists',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    LOGIN_FAILED: 'Login failed. Please check your credentials.'
  },
  API: {
    FETCH_FAILED: 'Failed to fetch data. Please try again.',
    UPDATE_FAILED: 'Failed to update data. Please try again.',
    DELETE_FAILED: 'Failed to delete data. Please try again.',
    CREATE_FAILED: 'Failed to create data. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You don\'t have permission for this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.'
  }
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION: 'Registration successful! You can now login with your account.',
  LOGIN: 'Login successful! Welcome back.',
  LOGOUT: 'Logout successful!'
}; 