import BookingModal from '@/components/booking/BookingModal';
import { AppColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface HealthcareProvider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  type: 'doctor' | 'nurse' | 'specialist';
  experience: string;
  rating: number;
  avatar: string;
  availability: string[];
  nextAvailable: string;
  consultationFee: number;
  hospital: string;
  bio: string;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  about?: string;
  reviews?: number;
}

const DoctorProfilePage = () => {
  const { providerId } = useLocalSearchParams();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const providers: HealthcareProvider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'MD, FACC',
      specialty: 'Cardiology',
      type: 'doctor',
      experience: '15 years',
      rating: 4.9,
      avatar: 'SJ',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      nextAvailable: 'Today 2:30 PM',
      consultationFee: 150,
      hospital: 'HomClinic Medical Center',
      bio: 'Specialized in preventive cardiology and heart disease management with extensive experience in interventional procedures.',
      education: ['MD - Harvard Medical School', 'Residency - Johns Hopkins Hospital', 'Fellowship - Mayo Clinic'],
      certifications: ['Board Certified in Cardiology', 'Advanced Cardiac Life Support', 'Interventional Cardiology'],
      languages: ['English', 'Spanish', 'French'],
      about: 'Dr. Sarah Johnson is a distinguished cardiologist with over 15 years of experience in cardiovascular medicine. She specializes in preventive cardiology, helping patients reduce their risk of heart disease through lifestyle modifications and advanced medical interventions. Dr. Johnson has performed over 2,000 cardiac procedures and has been recognized for her excellence in patient care.',
      reviews: 127,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'MD, FACS',
      specialty: 'Pediatric Surgery',
      type: 'specialist',
      experience: '12 years',
      rating: 4.8,
      avatar: 'MC',
      availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
      nextAvailable: 'Tomorrow 10:00 AM',
      consultationFee: 200,
      hospital: 'Children\'s Medical Center',
      bio: 'Expert in minimally invasive pediatric surgery with focus on congenital anomalies and trauma care.',
      education: ['MD - Stanford University', 'Pediatric Surgery Residency - Children\'s Hospital Boston'],
      certifications: ['Board Certified in Pediatric Surgery', 'Laparoscopic Surgery Certification'],
      languages: ['English', 'Mandarin'],
      about: 'Dr. Michael Chen is a renowned pediatric surgeon specializing in minimally invasive techniques for children. His expertise in congenital anomalies and trauma care has helped hundreds of families.',
      reviews: 89,
    },
    // Add other providers as needed
  ];

  const provider = providers.find(p => p.id === providerId) || providers[0];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return AppColors.primary.main;
      case 'nurse': return AppColors.secondary.main;
      case 'specialist': return AppColors.medical.brain;
      default: return AppColors.neutral.gray500;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'specialist': return '🔬';
      default: return '🏥';
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  const handleBookAppointment = () => {
    setShowBookingModal(true);
  };

  const handleContact = () => {
    Alert.alert(
      'Contact Options',
      'How would you like to contact the doctor?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', 'Connecting to hospital...') },
        { text: 'Message', onPress: () => Alert.alert('Messaging...', 'Opening chat...') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={AppColors.gradients.primary as [string, string]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor Profile</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>♡</Text>
          </TouchableOpacity>
        </View>

        {/* Doctor Basic Info */}
        <View style={styles.doctorBasicInfo}>
          <View style={[
            styles.doctorAvatar,
            { backgroundColor: getTypeColor(provider.type) + '20' }
          ]}>
            <Text style={[
              styles.avatarText,
              { color: getTypeColor(provider.type) }
            ]}>
              {provider.avatar}
            </Text>
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{provider.name}</Text>
            <Text style={styles.doctorTitle}>{provider.title}</Text>
            <Text style={styles.doctorSpecialty}>{provider.specialty}</Text>
            <View style={styles.ratingSection}>
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.stars}>{renderStars(provider.rating)}</Text>
              <Text style={styles.reviewCount}>({provider.reviews || 0} reviews)</Text>
            </View>
          </View>
          <View style={[
            styles.typeBadge,
            { backgroundColor: getTypeColor(provider.type) }
          ]}>
            <Text style={styles.typeIcon}>{getTypeIcon(provider.type)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{provider.experience}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{provider.consultationFee} XAF</Text>
            <Text style={styles.statLabel}>Consultation</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{provider.reviews || 0}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {provider.about || provider.bio}
          </Text>
        </View>

        {/* Hospital & Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospital & Availability</Text>
          <View style={styles.hospitalCard}>
            <Text style={styles.hospitalName}>🏥 {provider.hospital}</Text>
            <Text style={styles.availabilityText}>
              📅 Next Available: {provider.nextAvailable}
            </Text>
            <Text style={styles.availabilityDays}>
              Available: {provider.availability.join(', ')}
            </Text>
          </View>
        </View>

        {/* Education */}
        {provider.education && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {provider.education.map((edu, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>🎓</Text>
                <Text style={styles.listText}>{edu}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {provider.certifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {provider.certifications.map((cert, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>🏆</Text>
                <Text style={styles.listText}>{cert}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {provider.languages && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesContainer}>
              {provider.languages.map((language, index) => (
                <View key={index} style={styles.languageChip}>
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={handleContact}
        >
          <Text style={styles.contactButtonText}>💬Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        provider={{
          id: provider.id,
          name: provider.name,
          title: provider.title,
          specialty: provider.specialty,
          consultationFee: provider.consultationFee,
          hospital: provider.hospital,
          avatar: provider.avatar,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: AppColors.text.inverse,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: AppColors.text.inverse,
  },
  doctorBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
    marginBottom: 4,
  },
  doctorTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
    marginRight: 4,
  },
  stars: {
    fontSize: 12,
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  typeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: AppColors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: AppColors.text.secondary,
  },
  hospitalCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 12,
    padding: 16,
    shadowColor: AppColors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: AppColors.status.success,
    fontWeight: '600',
    marginBottom: 4,
  },
  availabilityDays: {
    fontSize: 12,
    color: AppColors.text.secondary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  listText: {
    fontSize: 14,
    color: AppColors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageChip: {
    backgroundColor: AppColors.primary.light,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  languageText: {
    fontSize: 12,
    color: AppColors.primary.main,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppColors.background.secondary,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    gap: 12,
    shadowColor: AppColors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  contactButton: {
    flex: 1,
    backgroundColor: AppColors.neutral.gray100,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contactButtonText: {
    color: AppColors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    flex: 1,
    backgroundColor: AppColors.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: AppColors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorProfilePage;