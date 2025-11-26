import { useState, useEffect, useCallback, useContext } from 'react';
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  getProfile,
  updateProfile,
  updateAvatar,
  getHistory,
} from '../api/authService';
import { AuthContext } from '../context/AuthContext';

export function useAuthStatus(refreshIntervalMs = 5 * 60 * 1000) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const response = await checkAuth();
    const status = getSessionStatus();

    if (response.success && response.data.is_authenticated && !status.isExpired) {
      setIsAuthenticated(true);
      setSessionExpired(false);
    } else {
      setIsAuthenticated(false);
      if (status.isExpired) {
        setSessionExpired(true);
        setError('Session expired. Please log in again.');
      }
    }

    setIsLoading(false);
  }, []);
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    const interval = setInterval(refreshAuth, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [refreshAuth, refreshIntervalMs]);

  useEffect(() => {
    window.addEventListener('click', updateActivityTimestamp);
    window.addEventListener('keydown', updateActivityTimestamp);

    return () => {
      window.removeEventListener('click', updateActivityTimestamp);
      window.removeEventListener('keydown', updateActivityTimestamp);
    };
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    sessionExpired,
    refreshAuth,
  };
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await loginUser(credentials);

      if (response.success) {
        setSuccess(true);
        setUser(response.data);
        updateActivityTimestamp();
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    isLoading,
    error,
    success,
    user,
  };
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const register = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setValidationErrors({});

    try {
      const response = await registerUser(credentials);

      if (response.success) {
        setSuccess(true);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        setValidationErrors(response.errors || {});
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    register,
    isLoading,
    error,
    success,
    validationErrors,
  };
}

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await logoutUser();

      if (response.success) {
        // Clear local storage
        localStorage.removeItem('lastActivity');
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    logout,
    isLoading,
    error,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProfile();

      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch profile';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await updateProfile(data);

        if (response.success) {
          setProfile(response.data);
          return { success: true, data: response.data };
        } else {
          setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to update profile';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const uploadAvatar = useCallback(
    async (file) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await updateAvatar(file);

        if (response.success) {
          setProfile((prev) => ({
            ...prev,
            avatar: response.data.avatar_url,
          }));
          return { success: true, data: response.data };
        } else {
          setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to upload avatar';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateUserProfile,
    uploadAvatar,
    refreshProfile: fetchProfile,
  };
}
export function useHistory(initialOptions = {}) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(
    async (options = initialOptions) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getHistory(options);

        if (response.success) {
          setHistory(response.data.scores || []);
          setStats(response.data.stats || null);
          return { success: true, data: response.data };
        } else {
          setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch history';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [initialOptions]
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    stats,
    isLoading,
    error,
    fetchHistory,
  };
}

export function useAuthContext(ContextToUse = AuthContext) {
  const context = useContext(ContextToUse || AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
