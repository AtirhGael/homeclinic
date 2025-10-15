import { AppColors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export enum MedicalToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  MEDICAL_ALERT = 'medical_alert',
  PRESCRIPTION = 'prescription',
  APPOINTMENT = 'appointment',
}

export interface MedicalToastConfig {
  id: string;
  type: MedicalToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    text: string;
    onPress: () => void;
  };
  dismissible?: boolean;
}

interface MedicalToastProps {
  toast: MedicalToastConfig;
  onDismiss: (id: string) => void;
  style?: any;
}

const MedicalToast: React.FC<MedicalToastProps> = ({
  toast,
  onDismiss,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        dismissToast();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case MedicalToastType.SUCCESS:
        return {
          backgroundColor: AppColors.status.success + 'F0',
          borderLeftColor: AppColors.status.success,
          iconColor: AppColors.status.success,
          icon: '✓',
        };
      case MedicalToastType.ERROR:
        return {
          backgroundColor: AppColors.status.error + 'F0',
          borderLeftColor: AppColors.status.error,
          iconColor: AppColors.status.error,
          icon: '⚠',
        };
      case MedicalToastType.WARNING:
        return {
          backgroundColor: AppColors.status.warning + 'F0',
          borderLeftColor: AppColors.status.warning,
          iconColor: AppColors.status.warning,
          icon: '⚠',
        };
      case MedicalToastType.INFO:
        return {
          backgroundColor: AppColors.status.info + 'F0',
          borderLeftColor: AppColors.status.info,
          iconColor: AppColors.status.info,
          icon: 'ℹ',
        };
      case MedicalToastType.MEDICAL_ALERT:
        return {
          backgroundColor: AppColors.medical.emergency + 'F0',
          borderLeftColor: AppColors.medical.emergency,
          iconColor: AppColors.medical.emergency,
          icon: '🚨',
        };
      case MedicalToastType.PRESCRIPTION:
        return {
          backgroundColor: AppColors.medical.heart + 'F0',
          borderLeftColor: AppColors.medical.heart,
          iconColor: AppColors.medical.heart,
          icon: '💊',
        };
      case MedicalToastType.APPOINTMENT:
        return {
          backgroundColor: AppColors.primary.main + 'F0',
          borderLeftColor: AppColors.primary.main,
          iconColor: AppColors.primary.main,
          icon: '📅',
        };
      default:
        return {
          backgroundColor: AppColors.neutral.gray100,
          borderLeftColor: AppColors.neutral.gray500,
          iconColor: AppColors.neutral.gray500,
          icon: 'ℹ',
        };
    }
  };

  const toastStyle = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor: toastStyle.backgroundColor,
          borderLeftColor: toastStyle.borderLeftColor,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: toastStyle.iconColor }]}>
            {toastStyle.icon}
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message ? (
            <Text style={styles.message}>{toast.message}</Text>
          ) : null}
        </View>

        <View style={styles.actionsContainer}>
          {toast.action && (
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: toastStyle.borderLeftColor }]}
              onPress={() => {
                toast.action?.onPress();
                dismissToast();
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionText, { color: toastStyle.iconColor }]}>
                {toast.action.text}
              </Text>
            </TouchableOpacity>
          )}

          {toast.dismissible !== false && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={dismissToast}
              activeOpacity={0.7}
            >
              <Text style={styles.dismissText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: AppColors.neutral.gray800,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text.primary,
    marginBottom: 2,
    lineHeight: 20,
  },
  message: {
    fontSize: 14,
    color: AppColors.text.secondary,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 14,
    color: AppColors.text.secondary,
    fontWeight: '600',
  },
});

export default MedicalToast;