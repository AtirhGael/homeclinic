import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_KEY);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // Simulated authentication
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: Date.now().toString(),
          email: email.toLowerCase(),
          name: email.split('@')[0],
        };

        const mockToken = `token_${Date.now()}`;

        // Store token securely
        await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
        // Store user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));

        setUser(mockUser);
        return true;
      } else {
        setError('Invalid email or password. Password must be at least 6 characters.');
        return false;
      }
    } catch (error) {
      setError('Sign in failed. Please try again.');
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Basic validation
      if (!email || !password || !name) {
        setError('All fields are required.');
        return false;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return false;
      }

      // TODO: Replace with actual API call
      // Simulated registration
      const newUser: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name: name.trim(),
      };

      const mockToken = `token_${Date.now()}`;

      // Store token securely
      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      // Store user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setUser(newUser);
      return true;
    } catch (error) {
      setError('Sign up failed. Please try again.');
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Remove stored data
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};