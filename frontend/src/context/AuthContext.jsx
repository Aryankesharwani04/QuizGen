import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { checkAuth, getProfile, logoutUser } from '../api/authService';
export const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile after successful login
  const refreshProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        setError(null);
        return response.data;
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        // First check if user is authenticated
        const authResponse = await checkAuth();

        console.log('Auth check response:', authResponse);

        // If checkAuth returns success with data, user is authenticated
        if (authResponse.success && authResponse.data) {
          // Extract data if response has nested data property
          const userData = authResponse.data.data || authResponse.data;
          console.log('Setting user to:', userData);

          setUser(userData);
          setIsAuthenticated(true);
          setError(null);
        } else {
          // User is not authenticated (either success: false or no data)
          setUser(null);
          setIsAuthenticated(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Auto-refresh profile every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshProfile().catch(err => console.error('Auto-refresh error:', err));
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshProfile]);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
