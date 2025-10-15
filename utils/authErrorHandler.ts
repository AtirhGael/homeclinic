import { Alert } from 'react-native';

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface AuthErrorOptions {
  showAlert?: boolean;
  useToast?: boolean;
  fallbackMessage?: string;
  onError?: (error: AuthError) => void;
  toastHandler?: (title: string, message: string) => void;
}

/**
 * Custom error handler for authentication operations
 * Handles both Redux toolkit errors and API errors consistently
 */
export class AuthErrorHandler {
  /**
   * Handle authentication errors with customizable options
   */
  static handleError(
    error: any,
    context: 'login' | 'signup' | 'forgotPassword' = 'login',
    options: AuthErrorOptions = {}
  ): AuthError {
    const {
      showAlert = false, // Prefer toast over alerts for medical app
      useToast = true,
      fallbackMessage = 'An unexpected error occurred. Please try again.',
      onError,
      toastHandler
    } = options;

    let processedError: AuthError;

    // Handle different error types
    if (error?.response?.data) {
      // API response error
      processedError = {
        message: error.response.data.message || error.response.data.error || fallbackMessage,
        field: error.response.data.field,
        code: error.response.data.code || error.response.status?.toString()
      };
    } else if (error?.message) {
      // Redux toolkit async thunk error or general JS error
      processedError = {
        message: error.message,
        code: error.code
      };
    } else if (typeof error === 'string') {
      // String error
      processedError = {
        message: error
      };
    } else {
      // Unknown error format
      processedError = {
        message: fallbackMessage,
        code: 'UNKNOWN_ERROR'
      };
    }

    // Add context-specific error handling
    processedError = this.addContextualHandling(processedError, context);

    // Show toast notification (preferred for medical app)
    if (useToast && toastHandler) {
      toastHandler(this.getErrorTitle(context), processedError.message);
    } else if (showAlert) {
      // Fallback to alert if toast not available
      Alert.alert(
        this.getErrorTitle(context),
        processedError.message,
        [{ text: 'OK', style: 'default' }]
      );
    }

    // Call custom error handler if provided
    if (onError) {
      onError(processedError);
    }

    // Log error for debugging
    console.error(`[${context.toUpperCase()}] Error:`, {
      original: error,
      processed: processedError
    });

    return processedError;
  }

  /**
   * Add context-specific error messages and handling
   */
  private static addContextualHandling(error: AuthError, context: string): AuthError {
    let enhancedMessage = error.message;

    // Common error patterns and their user-friendly messages
    const errorMappings: Record<string, string> = {
      // Network errors
      'Network request failed': 'Please check your internet connection and try again.',
      'fetch failed': 'Unable to connect to the server. Please check your internet connection.',
      'timeout': 'Request timed out. Please try again.',
      
      // Authentication specific
      'Invalid credentials': 'The email or password you entered is incorrect.',
      'User not found': 'No account found with this email address.',
      'Email already exists': 'An account with this email already exists.',
      'Username already exists': 'This username is already taken. Please choose another.',
      'Invalid email': 'Please enter a valid email address.',
      'Password too weak': 'Password must be at least 6 characters long.',
      'Token expired': 'Your session has expired. Please sign in again.',
      
      // Server errors
      'Internal server error': 'Something went wrong on our end. Please try again later.',
      '500': 'Server error. Please try again later.',
      '503': 'Service temporarily unavailable. Please try again later.',
    };

    // Check for known error patterns
    for (const [pattern, userMessage] of Object.entries(errorMappings)) {
      if (enhancedMessage.toLowerCase().includes(pattern.toLowerCase())) {
        enhancedMessage = userMessage;
        break;
      }
    }

    // Context-specific enhancements
    switch (context) {
      case 'login':
        if (enhancedMessage.includes('Invalid') || enhancedMessage.includes('incorrect')) {
          enhancedMessage += '\n\nForgot your password? You can reset it from the sign-in screen.';
        }
        break;
      
      case 'signup':
        if (enhancedMessage.includes('exists')) {
          enhancedMessage += '\n\nAlready have an account? Try signing in instead.';
        }
        break;
    }

    return {
      ...error,
      message: enhancedMessage
    };
  }

  /**
   * Get appropriate error title based on context
   */
  private static getErrorTitle(context: string): string {
    switch (context) {
      case 'login':
        return 'Sign In Failed';
      case 'signup':
        return 'Registration Failed';
      case 'forgotPassword':
        return 'Password Reset Failed';
      default:
        return 'Authentication Error';
    }
  }

  /**
   * Validate form field errors and return user-friendly messages
   */
  static validateField(field: string, value: string, context: 'login' | 'signup'): string | null {
    switch (field) {
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        if (!value.includes('@') || !value.includes('.')) {
          return 'Please enter a valid email address';
        }
        break;
      
      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (context === 'signup' && value.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        break;
      
      case 'fullname':
        if (context === 'signup' && !value.trim()) {
          return 'Full name is required';
        }
        break;
      
      case 'username':
        if (context === 'signup' && !value.trim()) {
          return 'Username is required';
        }
        if (context === 'signup' && value.length < 3) {
          return 'Username must be at least 3 characters long';
        }
        break;
      
      case 'confirmPassword':
        // This should be handled by comparing with password field
        break;
    }
    
    return null;
  }

  /**
   * Check if error is retryable (network issues, server errors, etc.)
   */
  static isRetryableError(error: AuthError): boolean {
    const retryablePatterns = [
      'network',
      'timeout',
      'server error',
      '500',
      '502',
      '503',
      '504',
      'fetch failed'
    ];

    return retryablePatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern) ||
      error.code?.toLowerCase().includes(pattern)
    );
  }
}

/**
 * Convenience function for handling authentication errors
 */
export const handleAuthError = (
  error: any,
  context: 'login' | 'signup' | 'forgotPassword' = 'login',
  options?: AuthErrorOptions
): AuthError => {
  return AuthErrorHandler.handleError(error, context, options);
};

/**
 * Convenience function for field validation
 */
export const validateAuthField = (
  field: string,
  value: string,
  context: 'login' | 'signup'
): string | null => {
  return AuthErrorHandler.validateField(field, value, context);
};