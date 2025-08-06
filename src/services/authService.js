import httpService from './httpService';
import { API_ENDPOINTS } from '../constants/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/validation';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
class AuthService {
  /**
   * User login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  async login(email, password) {
    try {
      const response = await httpService.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password },
        { requireAuth: false }
      );

      if (response.success) {
        // Extract user data and token from response
        // Handle nested data structure: response.data.data
        const userData = response.data.data || response.data;
        const token = userData.token || response.data.token;



        // Ensure user data has required fields
        const user = {
          id: userData.id || userData._id,
          email: userData.email,
          isAdmin: userData.isAdmin || false,
          ...userData
        };
        

        
        // Store user data and token
        this.setUserData(user);
        this.setToken(token);
        
        return {
          success: true,
          message: SUCCESS_MESSAGES.LOGIN,
          data: user
        };
      } else {
        return {
          success: false,
          message: response.error || ERROR_MESSAGES.GENERAL.LOGIN_FAILED
        };
      }
    } catch (error) {
      return {
        success: false,
        message: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR
      };
    }
  }

  /**
   * User registration
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Registration result
   */
  async register(email, password) {
    try {
      const response = await httpService.post(
        API_ENDPOINTS.AUTH.REGISTER,
        { email, password },
        { requireAuth: false }
      );

      if (response.success) {
        return {
          success: true,
          message: SUCCESS_MESSAGES.REGISTRATION,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.error || ERROR_MESSAGES.GENERAL.REGISTRATION_FAILED
        };
      }
    } catch (error) {
      return {
        success: false,
        message: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR
      };
    }
  }

  /**
   * User logout
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    try {
      // Call logout endpoint if available
      if (API_ENDPOINTS.AUTH.LOGOUT) {
        await httpService.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      // Logout API call failed, but continue with local cleanup
    } finally {
      // Always clear local data
      this.clearAuthData();
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT
    };
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUserData();
    return !!(token && user);
  }

  /**
   * Get stored authentication token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Set authentication token
   * @param {string} token - Authentication token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set user data
   * @param {Object} userData - User data object
   */
  setUserData(userData) {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken() {
    try {
      const response = await httpService.post(API_ENDPOINTS.AUTH.REFRESH);
      
      if (response.success) {
        this.setToken(response.data.token);
        return { success: true };
      } else {
        this.clearAuthData();
        return { success: false };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      return { success: false };
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  async getProfile() {
    try {
      const response = await httpService.post(API_ENDPOINTS.USER.PROFILE, { email: this.getUserData().email }, { requireAuth: true });
      
      if (response.success) {
        this.setUserData(response.data.data);

        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.error
        };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR
      };
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(profileData) {
    try {
      const response = await httpService.put(
        API_ENDPOINTS.USER.UPDATE,
        profileData
      );
      
      if (response.success) {
        this.setUserData(response.data);
        return {
          success: true,
          message: 'Profile updated successfully',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.error
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService; 