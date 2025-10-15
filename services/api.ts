import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL ='https://hcbackend-production.up.railway.app/api/1.0.0';
const TIMEOUT = 30000;

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tokenUtils = {
  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  setUserId: async (userId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    } catch (error) {
      console.error('Error saving user ID:', error);
    }
  },

  getUserId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(USER_ID_KEY);
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  },

  removeUserId: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_ID_KEY);
    } catch (error) {
      console.error('Error removing user ID:', error);
    }
  },

  clearAuth: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_ID_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};

// Request interceptor for authenticated API
privateApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenUtils.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
    }

    // make sure to remove this line before production
    // // console.log(`[AuthAPI] ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('[AuthAPI] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for authenticated API
privateApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response (remove in production)
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('[AuthAPI] Unauthorized - clearing auth data');
      await tokenUtils.clearAuth();
      
      // Note: In React Native, you should handle navigation differently
      // This line should be replaced with proper navigation logic
      // window.location.href = '/login';
    }

    if (error.response?.status >= 500) {
      console.error('[AuthAPI] Server error:', error.response.data);
    }

    console.error('[AuthAPI] Response error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor for unauthenticated API
publicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request for debugging (remove in production)
    // console.log(`[UnAuthAPI] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[UnAuthAPI] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for unauthenticated API
publicApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response (remove in production)
    // console.log(`[UnAuthAPI] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status >= 500) {
      console.error('[UnAuthAPI] Server error:', error.response.data);
    }

    console.error('[UnAuthAPI] Response error:', error);
    return Promise.reject(error);
  }
);


export default privateApi;