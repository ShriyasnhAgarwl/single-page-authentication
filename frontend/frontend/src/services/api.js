import axios from 'axios';
import { getToken, clearAuthData } from '../utils/auth';

// API base URL - ensure this matches your backend URL and port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with custom configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important for CORS: Enable credentials to send cookies
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = getToken();
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle session expiration or authentication errors
    if (response && response.status === 401) {
      clearAuthData();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Registration failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - API response
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Login failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

/**
 * Get current user profile
 * @returns {Promise} - API response
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error?.message || 'Failed to get user profile');
    }
    throw new Error('Network error. Please try again.');
  }
};

/**
 * Logout user (client-side only)
 * Could also call a backend logout endpoint if needed
 */
export const logout = async () => {
  clearAuthData();
  
  // If you have a backend logout endpoint, uncomment this:
  // try {
  //   await api.post('/auth/logout');
  // } catch (error) {
  //   console.error('Logout error:', error);
  // }
  
  return { success: true };
};

/**
 * Test CORS connection to the backend
 * Useful for debugging connection issues
 * @returns {Promise} - API response with CORS details
 */
export const testCorsConnection = async () => {
  try {
    console.log('Testing CORS connection to:', API_URL + '/test/cors');
    
    const response = await api.get('/test/cors');
    
    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('CORS test successful:', response.data);
      console.log('Response headers:', response.headers);
    }
    
    return {
      success: true,
      data: response.data,
      headers: response.headers
    };
  } catch (error) {
    console.error('CORS test failed:', error);
    
    // Provide detailed error information
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    };
    
    console.error('Error details:', errorDetails);
    
    return {
      success: false,
      error: errorDetails
    };
  }
};

export default api;

