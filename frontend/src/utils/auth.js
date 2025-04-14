/**
 * Authentication related utility functions and constants
 */

// Local storage keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

/**
 * Set authentication data in local storage
 * @param {Object} user - User object
 * @param {string} token - JWT token
 */
export const setAuthData = (user, token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

/**
 * Get authentication token from local storage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get user data from local storage
 * @returns {Object|null} - User object or null if not found
 */
export const getUser = () => {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      clearAuthData();
      return null;
    }
  }
  return null;
};

/**
 * Clear authentication data from local storage
 */
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

