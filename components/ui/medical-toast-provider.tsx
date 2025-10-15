import React, { createContext, ReactNode, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MedicalToast, { MedicalToastConfig, MedicalToastType } from './medical-toast';

interface MedicalToastContextType {
  showToast: (config: Omit<MedicalToastConfig, 'id'>) => void;
  showSuccess: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  showError: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  showWarning: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  showInfo: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  showMedicalAlert: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  showPrescriptionAlert: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  showAppointmentAlert: (title: string, message?: string, action?: MedicalToastConfig['action']) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const MedicalToastContext = createContext<MedicalToastContextType | undefined>(undefined);

interface MedicalToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const MedicalToastProvider: React.FC<MedicalToastProviderProps> = ({
  children,
  maxToasts = 3,
}) => {
  const [toasts, setToasts] = useState<MedicalToastConfig[]>([]);
  const insets = useSafeAreaInsets();

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const showToast = (config: Omit<MedicalToastConfig, 'id'>) => {
    const newToast: MedicalToastConfig = {
      ...config,
      id: generateId(),
      duration: config.duration ?? 5000, // Default 5 seconds
      dismissible: config.dismissible ?? true,
    };

    setToasts(prevToasts => {
      const updatedToasts = [newToast, ...prevToasts];
      // Limit the number of toasts
      return updatedToasts.slice(0, maxToasts);
    });
  };

  const dismissToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  // Convenience methods for different toast types
  const showSuccess = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.SUCCESS,
      title,
      message: message || '',
      action,
    });
  };

  const showError = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.ERROR,
      title,
      message: message || '',
      action,
      duration: 7000, // Errors stay longer
    });
  };

  const showWarning = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.WARNING,
      title,
      message: message || '',
      action,
      duration: 6000,
    });
  };

  const showInfo = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.INFO,
      title,
      message: message || '',
      action,
    });
  };

  const showMedicalAlert = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.MEDICAL_ALERT,
      title,
      message: message || '',
      action,
      duration: 10000, // Medical alerts stay longer
      dismissible: false, // Require user action
    });
  };

  const showPrescriptionAlert = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.PRESCRIPTION,
      title,
      message: message || '',
      action,
      duration: 8000,
    });
  };

  const showAppointmentAlert = (
    title: string,
    message?: string,
    action?: MedicalToastConfig['action']
  ) => {
    showToast({
      type: MedicalToastType.APPOINTMENT,
      title,
      message: message || '',
      action,
      duration: 6000,
    });
  };

  const contextValue: MedicalToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showMedicalAlert,
    showPrescriptionAlert,
    showAppointmentAlert,
    dismissToast,
    dismissAll,
  };

  return (
    <MedicalToastContext.Provider value={contextValue}>
      {children}
      {toasts.length > 0 && (
        <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="box-none">
          {toasts.map((toast) => (
            <MedicalToast
              key={toast.id}
              toast={toast}
              onDismiss={dismissToast}
            />
          ))}
        </View>
      )}
    </MedicalToastContext.Provider>
  );
};

export const useMedicalToast = (): MedicalToastContextType => {
  const context = useContext(MedicalToastContext);
  if (!context) {
    throw new Error('useMedicalToast must be used within a MedicalToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

export default MedicalToastProvider;