import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      // Since we're using mock authentication, just check if token exists
      if (token) {
        // Create a mock user profile from the token
        const mockUser = {
          id: token.split('-')[1] || 'user-1',
          email: 'demo@truststack.com',
          firstName: 'Demo',
          lastName: 'User',
          isVerified: true
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (email, password) => {
    try {
      // Skip API call entirely - use mock login immediately
      console.log('🔄 Using mock login (Vercel API blocked)...');
      
      // Create mock user for demo
      const mockUser = {
        id: `demo-${Date.now()}`,
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date().toISOString()
      };
      
      const mockToken = `demo-token-${Date.now()}`;
      
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      
      return { success: true, message: 'Login successful!' };
      
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Skip API call entirely - use mock registration immediately
      console.log('🔄 Using mock registration (Vercel API blocked)...');
      
      // Create mock user
      const mockUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = `token-${Date.now()}`;
      
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      
      return { success: true, message: 'Registration successful!' };
      
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

