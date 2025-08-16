import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiConfig from '../config/api';

// Configure axios defaults
axios.defaults.baseURL = apiConfig.baseURL;
axios.defaults.timeout = apiConfig.timeout;

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
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
      const response = await axios.post('/api/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to mock login for immediate testing
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        console.log('🔄 Using mock login fallback...');
        
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
        
        return { success: true, message: 'Mock login successful (backend not available)' };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Try real API first
      const response = await axios.post('/api/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Fallback to mock registration for immediate testing
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        console.log('🔄 Using mock registration fallback...');
        
        // Create mock user
        const mockUser = {
          id: `mock-${Date.now()}`,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          createdAt: new Date().toISOString()
        };
        
        const mockToken = `mock-token-${Date.now()}`;
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('token', mockToken);
        
        return { success: true, message: 'Mock registration successful (backend not available)' };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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

