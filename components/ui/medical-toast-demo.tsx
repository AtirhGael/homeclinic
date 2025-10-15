import { useMedicalToast } from '@/components/ui/medical-toast-provider';
import { AppColors } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Demo component showing how to use the Medical Toast system
 * This can be integrated into settings or debug screens
 */
export const MedicalToastDemo: React.FC = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showMedicalAlert,
    showPrescriptionAlert,
    showAppointmentAlert,
    dismissAll,
  } = useMedicalToast();

  const demoToasts = [
    {
      title: 'Success Toast',
      description: 'Account created successfully',
      action: () => showSuccess('Account Created', 'Welcome to HomeClinic! Your account has been set up.'),
      color: AppColors.status.success,
    },
    {
      title: 'Error Toast',
      description: 'Login failed error',
      action: () => showError('Login Failed', 'Invalid credentials. Please check your email and password.'),
      color: AppColors.status.error,
    },
    {
      title: 'Warning Toast',
      description: 'Form validation warning',
      action: () => showWarning('Incomplete Information', 'Please fill in all required fields before continuing.'),
      color: AppColors.status.warning,
    },
    {
      title: 'Info Toast',
      description: 'General information',
      action: () => showInfo('New Features', 'Check out our latest telemedicine features in the consultation tab.'),
      color: AppColors.status.info,
    },
    {
      title: 'Medical Alert',
      description: 'Critical medical notification',
      action: () => showMedicalAlert(
        'Medical Emergency',
        'If this is a medical emergency, please call 911 immediately.',
        { text: 'Call 911', onPress: () => console.log('Emergency call triggered') }
      ),
      color: AppColors.medical.emergency,
    },
    {
      title: 'Prescription Alert',
      description: 'Medication reminder',
      action: () => showPrescriptionAlert(
        'Medication Reminder',
        'Time to take your morning medication. Please follow the prescribed dosage.',
        { text: 'Mark Taken', onPress: () => console.log('Medication marked as taken') }
      ),
      color: AppColors.medical.heart,
    },
    {
      title: 'Appointment Alert',
      description: 'Upcoming appointment',
      action: () => showAppointmentAlert(
        'Appointment Reminder',
        'Your consultation with Dr. Smith is scheduled for tomorrow at 2:00 PM.',
        { text: 'View Details', onPress: () => console.log('Appointment details opened') }
      ),
      color: AppColors.primary.main,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medical Toast System Demo</Text>
      <Text style={styles.subtitle}>
        Professional toast notifications designed for medical applications
      </Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {demoToasts.map((toast, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.demoButton, { borderLeftColor: toast.color }]}
            onPress={toast.action}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>{toast.title}</Text>
              <Text style={styles.buttonDescription}>{toast.description}</Text>
            </View>
            <View style={[styles.colorIndicator, { backgroundColor: toast.color }]} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.demoButton, styles.dismissButton]}
          onPress={dismissAll}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Dismiss All Toasts</Text>
            <Text style={styles.buttonDescription}>Clear all active notifications</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.usage}>
        <Text style={styles.usageTitle}>Usage Examples:</Text>
        <Text style={styles.usageText}>
          • Success: Account creation, successful operations{'\n'}
          • Error: Login failures, validation errors{'\n'}
          • Warning: Form validation, non-critical issues{'\n'}
          • Info: Feature announcements, general info{'\n'}
          • Medical Alert: Emergency situations, critical health info{'\n'}
          • Prescription: Medication reminders, dosage alerts{'\n'}
          • Appointment: Upcoming consultations, scheduling
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  demoButton: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: AppColors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dismissButton: {
    borderLeftColor: AppColors.neutral.gray500,
    marginTop: 8,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  usage: {
    marginTop: 20,
    padding: 16,
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  usageText: {
    fontSize: 14,
    color: AppColors.text.secondary,
    lineHeight: 20,
  },
});

export default MedicalToastDemo;