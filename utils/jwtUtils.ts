import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

/**
 * Decode JWT token to get user information
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padding = base64.length % 4;
    const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;
    
    // Use Buffer for React Native
    const jsonPayload = Buffer.from(paddedBase64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Get user ID from stored auth token
 * @returns User ID string or null if not found
 */
export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      return null;
    }
    
    const decoded = decodeJWT(token);
    // console.log(decoded,'decoded decoded');
    
    return decoded?.userId || decoded?.id || decoded?.sub || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token JWT token string
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};