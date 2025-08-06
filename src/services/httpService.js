import { API_CONFIG, DEFAULT_HEADERS } from '../constants/api';

/**
 * HTTP Service for making API requests
 */
class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  /**
   * Creates a timeout promise
   * @param {number} ms - Timeout in milliseconds
   * @returns {Promise} Timeout promise
   */
  createTimeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), ms);
    });
  }

  /**
   * Adds authentication token to headers
   * @param {Object} headers - Request headers
   * @returns {Object} Headers with auth token
   */
  addAuthHeader(headers = {}) {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        ...headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return headers;
  }

  /**
   * Handles API response
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Processed response
   */
  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data,
          status: response.status,
          statusText: response.statusText
        };
      } else {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
          data: null
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid JSON response from server',
        status: response.status,
        statusText: response.statusText,
        data: null
      };
    }
  }

  /**
   * Makes HTTP request with retry logic
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @param {number} attempt - Current attempt number
   * @returns {Promise<Object>} API response
   */
  async makeRequest(url, options = {}, attempt = 1) {
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      
      const requestOptions = {
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers
        },
        ...options
      };

      // Add auth header if needed
      if (options.requireAuth !== false) {
        requestOptions.headers = this.addAuthHeader(requestOptions.headers);
      }

      // Create request with timeout
      const requestPromise = fetch(fullUrl, requestOptions);
      const timeoutPromise = this.createTimeout(this.timeout);
      
      const response = await Promise.race([requestPromise, timeoutPromise]);
      
      return await this.handleResponse(response);
      
    } catch (error) {
      // Retry logic for network errors
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`Request failed, retrying... (${attempt}/${this.retryAttempts})`);
        await this.delay(1000 * attempt); // Exponential backoff
        return this.makeRequest(url, options, attempt + 1);
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error),
        status: null,
        statusText: null,
        data: null
      };
    }
  }

  /**
   * Determines if request should be retried
   * @param {Error} error - Request error
   * @returns {boolean} True if should retry
   */
  shouldRetry(error) {
    const retryableErrors = [
      'NetworkError',
      'TypeError',
      'Request timeout'
    ];
    
    return retryableErrors.some(errorType => 
      error.message.includes(errorType) || error.name === errorType
    );
  }

  /**
   * Gets user-friendly error message
   * @param {Error} error - Request error
   * @returns {string} Error message
   */
  getErrorMessage(error) {
    if (error.message.includes('timeout')) {
      return 'Request timeout. Please try again.';
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Delays execution for specified time
   * @param {number} ms - Delay in milliseconds
   * @returns {Promise} Delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async get(url, options = {}) {
    return this.makeRequest(url, {
      method: 'GET',
      ...options
    });
  }

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async post(url, data = null, options = {}) {
    return this.makeRequest(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });
  }

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async put(url, data = null, options = {}) {
    return this.makeRequest(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });
  }

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async delete(url, options = {}) {
    return this.makeRequest(url, {
      method: 'DELETE',
      ...options
    });
  }
}

// Export singleton instance
export const httpService = new HttpService();
export default httpService; 