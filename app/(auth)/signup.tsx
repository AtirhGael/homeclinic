import { useMedicalToast } from '@/components/ui/medical-toast-provider';
import { AppColors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, register } from '@/store/slice/authSlice';
import { handleAuthError } from '@/utils/authErrorHandler';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    whatsappNum: '',
    password: '',
    confirmPassword: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    fullname: false,
    username: false,
    email: false,
    whatsappNum: false,
    password: false,
    confirmPassword: false,
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
      fullname: false,
      username: false,
      email: false,
      whatsappNum: false,
      password: false,
      confirmPassword: false,
    };

    if (!formData.fullname.trim()) {
      errors.fullname = true;
    }
    if (!formData.username.trim()) {
      errors.username = true;
    }
    if (!formData.email.trim()) {
      errors.email = true;
    }
    if (formData.email.trim() && !formData.email.includes('@')) {
      errors.email = true;
    }
    if (formData.password.length < 6) {
      errors.password = true;
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = true;
    }

    setFieldErrors(errors);
  
    return !Object.values(errors).some(error => error);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const payloadData = {
      fullname: formData.fullname,
      username: formData.username,
      email: formData.email,
      whatsappNum: formData.whatsappNum,
      password: formData.confirmPassword,
    };
    console.log('payload data', payloadData);
    try {
      const response = await dispatch(register(payloadData));
      console.log(response.payload, 'payload data');
      

      if (register.fulfilled.match(response)) {
        showSuccess(
          'Account Created Successfully!',
          'Welcome to HomeClinic. You can now access all our medical services.',
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)'),
          }
        ); 
        showSuccess(
          'Account Created Successfully!',
          'Welcome to HomeClinic. You can now access all our medical services.',
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)')
          }
        );
        router.replace('/(tabs)');
      } else {
        // Handle rejection
        console.log(response.payload, 'payload data');
        
        handleAuthError(response.payload || response.error, 'signup', {
          useToast: true,
          toastHandler: showError,
        });
      }
    } catch (err) {
      handleAuthError(err, 'signup', {
        useToast: true,
        toastHandler: showError,
      });
    }
  };

  const handleSignInPress = () => {
    router.push('/(auth)/signin');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right','bottom']}>
      <StatusBar style='dark' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join HomeClinic today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, fieldErrors.fullname && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.fullname}
                onChangeText={(value) => handleInputChange('fullname', value)}
                autoCapitalize="words"
                returnKeyType="next"
              />
              {fieldErrors.fullname && (
                <Text style={styles.errorMessage}>Please enter your full name</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User Name</Text>
              <TextInput
                style={[styles.input, fieldErrors.username && styles.inputError]}
                placeholder="Enter your user name"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="words"
                returnKeyType="next"
              />
              {fieldErrors.username && (
                <Text style={styles.errorMessage}>Please enter your username</Text>
              )}
            </View>

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
              <Text style={styles.label}>WhatsApp Number</Text>
              <TextInput
                style={[styles.input, fieldErrors.whatsappNum && styles.inputError]}
                placeholder="Enter your WhatsApp number"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.whatsappNum}
                onChangeText={(value) => handleInputChange('whatsappNum', value)}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
              {fieldErrors.whatsappNum && (
                <Text style={styles.errorMessage}>Please enter your WhatsApp number</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, fieldErrors.password && styles.inputError]}
                placeholder="Create a password"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                returnKeyType="next"
              />
              {fieldErrors.password && (
                <Text style={styles.errorMessage}>Password must be at least 6 characters long</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, fieldErrors.confirmPassword && styles.inputError]}
                placeholder="Confirm your password"
                placeholderTextColor={AppColors.text.tertiary}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              {fieldErrors.confirmPassword && (
                <Text style={styles.errorMessage}>Passwords do not match</Text>
              )}
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignInPress}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
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
  signUpButton: {
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
  signUpButtonText: {
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
  signInButton: {
    borderWidth: 2,
    borderColor: AppColors.primary.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInButtonText: {
    color: AppColors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
});