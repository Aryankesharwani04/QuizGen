import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, UserProfile, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAuth = async () => {
    try {
      const response = await api.checkAuth();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      // User is not authenticated, which is fine
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data);
        toast({
          title: 'Success',
          description: response.message || 'Login successful',
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Login Failed',
        description: apiError.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      setLoading(true);
      const response = await api.register({
        full_name: fullName,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      
      if (response.success && response.data) {
        setUser(response.data);
        toast({
          title: 'Success',
          description: response.message || 'Registration successful',
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      let errorMessage = apiError.message || 'Registration failed';
      
      // Extract specific field errors if available
      if (apiError.errors) {
        const errorMessages = Object.entries(apiError.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        errorMessage = errorMessages || errorMessage;
      }
      
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Logout Failed',
        description: apiError.message || 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
