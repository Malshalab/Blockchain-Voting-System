// frontend/src/utils/auth.js

/**
 * Checks if the user is authenticated by verifying that a JWT exists.
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  
  /**
   * Retrieves the stored JWT token.
   */
  export const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  
  /**
   * Stores the provided JWT token.
   * @param {string} token - The JWT token to store.
   */
  export const setAuthToken = (token) => {
    localStorage.setItem("token", token);
  };
  
  /**
   * Clears the stored JWT token.
   */
  export const clearAuthToken = () => {
    localStorage.removeItem("token");
  };

  export const isTokenValid = () => {
    const token = getAuthToken();
    return !!(token && token.trim() !== "");
  };