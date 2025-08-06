// Debug utility for authentication troubleshooting
export const debugAuth = {
  logAuthState: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 Auth Debug Info:');
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!user);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('User data:', userData);
        console.log('User email:', userData.email);
        console.log('User isAdmin:', userData.isAdmin);
      } catch (e) {
        console.log('Failed to parse user data:', e);
      }
    }
    
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 20) + '...');
    }
  },
  
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🧹 Auth data cleared');
  },
  
  setMockAuth: () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      isAdmin: true,
      name: 'Admin User'
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    console.log('🎭 Mock auth data set:', mockUser);
  },
  
  testAuthPersistence: () => {
    console.log('🧪 Testing Auth Persistence...');
    
    // Check current state
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Current localStorage:');
    console.log('- Token:', token ? 'EXISTS' : 'MISSING');
    console.log('- User:', user ? 'EXISTS' : 'MISSING');
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('- User data:', userData);
        console.log('- User email:', userData.email);
        console.log('- User isAdmin:', userData.isAdmin);
      } catch (e) {
        console.log('- User data parsing failed:', e);
      }
    }
    
    // Test authService methods (simplified for browser console)
    console.log('AuthService check:');
    console.log('- Token exists:', !!token);
    console.log('- User exists:', !!user);
    console.log('- Both exist:', !!(token && user));
  }
}; 