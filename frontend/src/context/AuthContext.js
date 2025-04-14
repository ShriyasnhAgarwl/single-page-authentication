import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login as loginApi, register as registerApi, getCurrentUser } from '../services/api';
import { setAuthData, getToken, getUser, clearAuthData, isAuthenticated } from '../utils/auth';

// Create Auth Context
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth-related functions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        if (isAuthenticated()) {
          // Get stored user or fetch from API
          const storedUser = getUser();
          if (storedUser) {
            setUser(storedUser);
            // Optionally refresh user data
            try {
              const response = await getCurrentUser();
              setUser(response.data.user);
            } catch (error) {
              // If token is invalid, handle silently and log out
              if (error.response && error.response.status === 401) {
                handleLogout();
              }
            }
          } else {
            // If no stored user but token exists, fetch user data
            const response = await getCurrentUser();
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handle user login
   * @param {Object} credentials - Email and password
   */
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginApi(credentials);
      const { user, token } = response.data;
      
      // Store auth data
      setAuthData(user, token);
      setUser(user);
      
      // Show success notification
      toast.success('Successfully logged in!');
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Login failed');
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user registration
   * @param {Object} userData - Registration data
   */
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await registerApi(userData);
      const { user, token } = response.data;
      
      // Store auth data
      setAuthData(user, token);
      setUser(user);
      
      // Show success notification
      toast.success('Account created successfully!');
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Registration failed');
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    // Clear auth data
    clearAuthData();
    setUser(null);
    
    // Clear cached queries
    queryClient.clear();
    
    // Show success notification
    toast.success('Successfully logged out!');
  };

  /**
   * Refresh current user data
   */
  const refreshUser = async () => {
    try {
      setLoading(true);
      
      const response = await getCurrentUser();
      const userData = response.data.user;
      
      setUser(userData);
      
      // Update stored user
      const token = getToken();
      if (token) {
        setAuthData(userData, token);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

