import axios from 'axios';
import { getToken, clearAuthData } from '../utils/auth';

// Create axios instance with default config
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle session expiration
    if (response && response.status === 401) {
      clearAuthData();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Authentication API functions

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

export default api;

