const API_BASE_URL = 'https://vivian-claude.onrender.com';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (response.ok) {
    return { success: true, data };
  } else {
    return { 
      success: false, 
      error: data.message || `HTTP ${response.status}: ${response.statusText}` 
    };
  }
};

// API functions
export const api = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      return await handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Register user
  register: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      return await handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  }
};

export default api; 