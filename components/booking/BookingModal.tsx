import { AppColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  provider?: {
    id: string;
    name: string;
    title: string;
    specialty: string;
    consultationFee: number;
    hospital: string;
    avatar: string;
  };
}

type BookingStep = 'visit-type' | 'date-time' | 'payment' | 'success';
type VisitType = 'home' | 'clinic';
type PaymentMethod = 'mtn' | 'orange';

interface BookingData {
  visitType: VisitType | null;
  date: string;
  time: string;
  paymentMethod: PaymentMethod | null;
  phoneNumber: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose, provider }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('visit-type');
  const [bookingData, setBookingData] = useState<BookingData>({
    visitType: null,
    date: '',
    time: '',
    paymentMethod: null,
    phoneNumber: '',
  });

  const resetModal = () => {
    setCurrentStep('visit-type');
    setBookingData({
      visitType: null,
      date: '',
      time: '',
      paymentMethod: null,
      phoneNumber: '',
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleVisitTypeSelect = (type: VisitType) => {
    setBookingData(prev => ({ ...prev, visitType: type }));
    setCurrentStep('date-time');
  };

  const handleDateTimeConfirm = () => {
    if (!bookingData.date || !bookingData.time) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }
    setCurrentStep('payment');
  };

  const handlePayment = () => {
    if (!bookingData.paymentMethod || !bookingData.phoneNumber) {
      Alert.alert('Error', 'Please select payment method and enter phone number');
      return;
    }

    // Simulate payment processing
    Alert.alert(
      'Processing Payment',
      'Please confirm the payment on your phone...',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setTimeout(() => {
              setCurrentStep('success');
            }, 1000);
          },
        },
      ]
    );
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        full: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
      });
    }
    return dates;
  };

  const renderVisitTypeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Visit Type</Text>
      <Text style={styles.stepSubtitle}>How would you like to consult with {provider?.name}?</Text>
      
      <TouchableOpacity
        style={[styles.optionCard, bookingData.visitType === 'clinic' && styles.selectedOption]}
        onPress={() => handleVisitTypeSelect('clinic')}
      >
        <Text style={styles.optionIcon}>🏥</Text>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Clinic Visit</Text>
          <Text style={styles.optionDescription}>
            Visit {provider?.hospital} for in-person consultation
          </Text>
          <Text style={styles.optionPrice}>Fee: {provider?.consultationFee} XAF</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, bookingData.visitType === 'home' && styles.selectedOption]}
        onPress={() => handleVisitTypeSelect('home')}
      >
        <Text style={styles.optionIcon}>🏠</Text>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Home Visit</Text>
          <Text style={styles.optionDescription}>
            Doctor visits you at your location
          </Text>
          <Text style={styles.optionPrice}>Fee: {(provider?.consultationFee || 0) + 50} XAF (+50 XAF transport)</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDateTimeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      <Text style={styles.stepSubtitle}>Choose your preferred appointment slot</Text>
      
      <Text style={styles.sectionLabel}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {generateDates().map((date) => (
          <TouchableOpacity
            key={date.full}
            style={[styles.dateCard, bookingData.date === date.full && styles.selectedDate]}
            onPress={() => setBookingData(prev => ({ ...prev, date: date.full }))}
          >
            <Text style={[styles.dateText, bookingData.date === date.full && styles.selectedDateText]}>
              {date.display}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {bookingData.date && (
        <>
          <Text style={styles.sectionLabel}>Select Time</Text>
          <ScrollView style={styles.timeScrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.timeGrid}>
              {generateTimeSlots().map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeSlot, bookingData.time === time && styles.selectedTime]}
                  onPress={() => setBookingData(prev => ({ ...prev, time }))}
                >
                  <Text style={[styles.timeText, bookingData.time === time && styles.selectedTimeText]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.continueButton} onPress={handleDateTimeConfirm}>
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Payment</Text>
      <Text style={styles.stepSubtitle}>Pay booking fee to confirm your appointment</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Doctor:</Text>
          <Text style={styles.summaryValue}>{provider?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Visit Type:</Text>
          <Text style={styles.summaryValue}>
            {bookingData.visitType === 'home' ? '🏠 Home Visit' : '🏥 Clinic Visit'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date & Time:</Text>
          <Text style={styles.summaryValue}>
            {new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Booking Fee:</Text>
          <Text style={styles.totalValue}>1,000 XAF</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Choose Payment Method</Text>
      
      <TouchableOpacity
        style={[styles.paymentCard, bookingData.paymentMethod === 'mtn' && styles.selectedPayment]}
        onPress={() => setBookingData(prev => ({ ...prev, paymentMethod: 'mtn' }))}
      >
        <Text style={styles.paymentIcon}>📱</Text>
        <View style={styles.paymentContent}>
          <Text style={styles.paymentTitle}>MTN Mobile Money</Text>
          <Text style={styles.paymentDescription}>Pay with MTN MoMo</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentCard, bookingData.paymentMethod === 'orange' && styles.selectedPayment]}
        onPress={() => setBookingData(prev => ({ ...prev, paymentMethod: 'orange' }))}
      >
        <Text style={styles.paymentIcon}>🧡</Text>
        <View style={styles.paymentContent}>
          <Text style={styles.paymentTitle}>Orange Money</Text>
          <Text style={styles.paymentDescription}>Pay with Orange Money</Text>
        </View>
      </TouchableOpacity>

      {bookingData.paymentMethod && (
        <View style={styles.phoneInputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter your phone number"
            value={bookingData.phoneNumber}
            onChangeText={(text) => setBookingData(prev => ({ ...prev, phoneNumber: text }))}
            keyboardType="phone-pad"
          />
        </View>
      )}

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay 1,000 XAF</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successMessage}>
          Your appointment has been successfully booked. You will receive a confirmation SMS shortly.
        </Text>
        
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>Appointment Details</Text>
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Doctor:</Text>
            <Text style={styles.confirmationValue}>{provider?.name}</Text>
          </View>
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Date:</Text>
            <Text style={styles.confirmationValue}>
              {new Date(bookingData.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Time:</Text>
            <Text style={styles.confirmationValue}>{bookingData.time}</Text>
          </View>
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Type:</Text>
            <Text style={styles.confirmationValue}>
              {bookingData.visitType === 'home' ? 'Home Visit' : 'Clinic Visit'}
            </Text>
          </View>
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Booking ID:</Text>
            <Text style={styles.confirmationValue}>#BK{Date.now().toString().slice(-6)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'visit-type':
        return renderVisitTypeStep();
      case 'date-time':
        return renderDateTimeStep();
      case 'payment':
        return renderPaymentStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderVisitTypeStep();
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={AppColors.gradients.primary as [string, string]}
      style={styles.header}
    >
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeIcon}>×</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Book Appointment</Text>
      <View style={styles.headerSpacer} />
    </LinearGradient>
  );

  const renderProgressBar = () => {
    const steps = ['visit-type', 'date-time', 'payment', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <View style={[
              styles.progressDot,
              index <= currentIndex && styles.progressDotActive
            ]}>
              <Text style={[
                styles.progressNumber,
                index <= currentIndex && styles.progressNumberActive
              ]}>
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.progressLine,
                index < currentIndex && styles.progressLineActive
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {renderHeader()}
        {currentStep !== 'success' && renderProgressBar()}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: AppColors.text.inverse,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  headerSpacer: {
    width: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppColors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotActive: {
    backgroundColor: AppColors.primary.main,
  },
  progressNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.text.secondary,
  },
  progressNumberActive: {
    color: AppColors.text.inverse,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: AppColors.neutral.gray200,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: AppColors.primary.main,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: AppColors.text.secondary,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: AppColors.primary.main,
    backgroundColor: AppColors.primary.light + '20',
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: AppColors.text.secondary,
    marginBottom: 8,
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.primary.main,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  dateScroll: {
    marginBottom: 20,
  },
  dateCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border.light,
  },
  selectedDate: {
    backgroundColor: AppColors.primary.main,
    borderColor: AppColors.primary.main,
  },
  dateText: {
    fontSize: 12,
    color: AppColors.text.secondary,
    textAlign: 'center',
  },
  selectedDateText: {
    color: AppColors.text.inverse,
    fontWeight: 'bold',
  },
  timeScrollContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    padding: 12,
    width: (width - 56) / 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border.light,
  },
  selectedTime: {
    backgroundColor: AppColors.primary.main,
    borderColor: AppColors.primary.main,
  },
  timeText: {
    fontSize: 12,
    color: AppColors.text.secondary,
  },
  selectedTimeText: {
    color: AppColors.text.inverse,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: AppColors.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: AppColors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: AppColors.text.primary,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: AppColors.border.light,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.primary.main,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPayment: {
    borderColor: AppColors.primary.main,
    backgroundColor: AppColors.primary.light + '20',
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  phoneInputContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  phoneInput: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: AppColors.text.primary,
    borderWidth: 1,
    borderColor: AppColors.border.light,
  },
  payButton: {
    backgroundColor: AppColors.status.success,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: AppColors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  confirmationCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 16,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  confirmationValue: {
    fontSize: 14,
    color: AppColors.text.primary,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: AppColors.primary.main,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  doneButtonText: {
    color: AppColors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingModal;