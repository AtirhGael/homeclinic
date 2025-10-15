import { useMedicalToast } from '@/components/ui/medical-toast-provider';
import { AppColors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, login } from '@/store/slice/authSlice';
import { handleAuthError } from '@/utils/authErrorHandler';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { showError, showSuccess } = useMedicalToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    setFieldErrors(prev => ({ ...prev, [field]: false }));
    dispatch(clearError());
  };

  const validateForm = () => {
    const errors = {
      email: false,
      password: false,
    };

    if (!formData.email.trim()) {
      errors.email = true;
    }
    if (formData.email.trim() && !formData.email.includes('@')) {
      errors.email = true;
    }
    if (!formData.password) {
      errors.password = true;
    }

    setFieldErrors(errors);
    
    // Return true if no errors
    return !Object.values(errors).some(error => error);
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      const response = await dispatch(login({ 
        email: formData.email, 
        password: formData.password 
      }));
      
      if (login.fulfilled.match(response)) {
        showSuccess(
          'Welcome Back!',
          'You have successfully signed in to HomeClinic.',
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)')
          }
        );
        router.replace('/(tabs)');
      } else {
        // Handle rejection
        handleAuthError(response.payload || response.error, 'login', {
          useToast: true,
          toastHandler: showError,
        });
      }
    } catch (err) {
      handleAuthError(err, 'login', {
        useToast: true,
        toastHandler: showError,
      });
    }
  };

  const handleSignUpPress = () => {
    router.push('/(auth)/signup');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to HomeClinic</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, fieldErrors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              {fieldErrors.email && (
                <Text style={styles.errorMessage}>
                  {!formData.email.trim() 
                    ? 'Please enter your email' 
                    : 'Please enter a valid email address'
                  }
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, fieldErrors.password && styles.inputError]}
                placeholder="Enter your password"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
              {fieldErrors.password && (
                <Text style={styles.errorMessage}>Please enter your password</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUpPress}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.background.secondary,
    borderWidth: 1,
    borderColor: AppColors.border.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: AppColors.text.primary,
  },
  inputError: {
    borderColor: AppColors.status.error,
    borderWidth: 2,
  },
  errorMessage: {
    color: AppColors.status.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: AppColors.primary.main,
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: AppColors.status.error + '20',
    borderWidth: 1,
    borderColor: AppColors.status.error + '40',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: AppColors.status.error,
    fontSize: 14,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: AppColors.primary.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: AppColors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: AppColors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.border.light,
  },
  dividerText: {
    marginHorizontal: 16,
    color: AppColors.text.secondary,
    fontSize: 14,
  },
  signUpButton: {
    borderWidth: 2,
    borderColor: AppColors.primary.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  signUpButtonText: {
    color: AppColors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: AppColors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});