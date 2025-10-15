import BookingModal from '@/components/booking/BookingModal';
import { AppColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
}

const SchedulePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'doctor' | 'nurse' | 'specialist'>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<HealthcareProvider | null>(null);

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
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'RN, BSN',
      specialty: 'Critical Care Nursing',
      type: 'nurse',
      experience: '8 years',
      rating: 4.7,
      avatar: 'ER',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      nextAvailable: 'Today 4:00 PM',
      consultationFee: 80,
      hospital: 'HomClinic Medical Center',
      bio: 'Specialized in critical care nursing with expertise in patient monitoring and emergency response.',
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      title: 'MD, MS',
      specialty: 'Orthopedic Surgery',
      type: 'doctor',
      experience: '18 years',
      rating: 4.9,
      avatar: 'JW',
      availability: ['Tuesday', 'Thursday', 'Friday'],
      nextAvailable: 'Monday 9:00 AM',
      consultationFee: 180,
      hospital: 'Orthopedic Institute',
      bio: 'Leading orthopedic surgeon specializing in joint replacement and sports medicine injuries.',
    },
    {
      id: '5',
      name: 'Dr. Lisa Park',
      title: 'MD, PhD',
      specialty: 'Dermatology',
      type: 'specialist',
      experience: '10 years',
      rating: 4.8,
      avatar: 'LP',
      availability: ['Monday', 'Wednesday', 'Friday'],
      nextAvailable: 'Wednesday 11:30 AM',
      consultationFee: 120,
      hospital: 'Skin Care Center',
      bio: 'Board-certified dermatologist with expertise in cosmetic and medical dermatology procedures.',
    },
    {
      id: '6',
      name: 'Maria Garcia',
      title: 'RN, MSN',
      specialty: 'Family Medicine',
      type: 'nurse',
      experience: '12 years',
      rating: 4.9,
      avatar: 'MG',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      nextAvailable: 'Today 1:15 PM',
      consultationFee: 70,
      hospital: 'Family Health Clinic',
      bio: 'Experienced family medicine nurse practitioner providing comprehensive primary care services.',
    },
    {
      id: '7',
      name: 'Dr. Robert Kim',
      title: 'MD, PhD',
      specialty: 'Neurology',
      type: 'specialist',
      experience: '20 years',
      rating: 4.9,
      avatar: 'RK',
      availability: ['Tuesday', 'Wednesday', 'Thursday'],
      nextAvailable: 'Thursday 3:00 PM',
      consultationFee: 250,
      hospital: 'Neurological Institute',
      bio: 'Renowned neurologist specializing in movement disorders and neurodegenerative diseases.',
    },
    {
      id: '8',
      name: 'Dr. Amanda White',
      title: 'MD, FACOG',
      specialty: 'Gynecology',
      type: 'doctor',
      experience: '14 years',
      rating: 4.8,
      avatar: 'AW',
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      nextAvailable: 'Tuesday 2:00 PM',
      consultationFee: 160,
      hospital: 'Women\'s Health Center',
      bio: 'Compassionate gynecologist with expertise in reproductive health and minimally invasive procedures.',
    },
  ];

  const getFilteredProviders = () => {
    let filtered = providers;
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.type === selectedType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => b.rating - a.rating);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'specialist': return '🔬';
      default: return '🏥';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return AppColors.primary.main;
      case 'nurse': return AppColors.secondary.main;
      case 'specialist': return AppColors.medical.brain;
      default: return AppColors.neutral.gray500;
    }
  };

  const handleBookAppointment = (provider: HealthcareProvider) => {
    setSelectedProvider(provider);
    setShowBookingModal(true);
  };

  const handleViewProfile = (provider: HealthcareProvider) => {
    router.push({
      pathname: '/pages/doctor-profile',
      params: { providerId: provider.id }
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  const typeFilters = [
    { key: 'all', label: 'All', icon: '🏥' },
    { key: 'doctor', label: 'Doctors', icon: '👨‍⚕️' },
    { key: 'nurse', label: 'Nurses', icon: '👩‍⚕️' },
    { key: 'specialist', label: 'Specialists', icon: '🔬' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
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
          <Text style={styles.headerTitle}>Schedule Appointment</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, nurses, specialists..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Type Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {typeFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedType === filter.key && styles.activeFilterChip
            ]}
            onPress={() => setSelectedType(filter.key as any)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text style={[
              styles.filterText,
              selectedType === filter.key && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {getFilteredProviders().length} healthcare providers available
        </Text>
      </View>

      {/* Providers List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.providersContainer}
      >
        {getFilteredProviders().map((provider) => (
          <View key={provider.id} style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <View style={styles.providerInfo}>
                <View style={[
                  styles.providerAvatar,
                  { backgroundColor: getTypeColor(provider.type) + '20' }
                ]}>
                  <Text style={[
                    styles.avatarText,
                    { color: getTypeColor(provider.type) }
                  ]}>
                    {provider.avatar}
                  </Text>
                </View>
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerTitle}>{provider.title}</Text>
                  <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                </View>
              </View>
              <View style={styles.providerMeta}>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(provider.type) }
                ]}>
                  <Text style={styles.typeIcon}>{getTypeIcon(provider.type)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.providerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rating</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>{provider.rating}</Text>
                  <Text style={styles.stars}>{renderStars(provider.rating)}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Experience</Text>
                <Text style={styles.statValue}>{provider.experience}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Fee</Text>
                <Text style={styles.statValue}>{provider.consultationFee}XAF</Text>
              </View>
            </View>

            <View style={styles.availabilitySection}>
              <Text style={styles.availabilityLabel}>Hospital:</Text>
              <Text style={styles.hospitalName}>{provider.hospital}</Text>
              <Text style={styles.nextAvailable}>Next available: {provider.nextAvailable}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => handleViewProfile(provider)}
              >
                <Text style={styles.profileButtonText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => handleBookAppointment(provider)}
              >
                <Text style={styles.bookButtonText}>Consult</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {getFilteredProviders().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedProvider(null);
        }}
        provider={selectedProvider ? {
          id: selectedProvider.id,
          name: selectedProvider.name,
          title: selectedProvider.title,
          specialty: selectedProvider.specialty,
          consultationFee: selectedProvider.consultationFee,
          hospital: selectedProvider.hospital,
          avatar: selectedProvider.avatar,
        } : undefined}
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
    paddingTop: 50,
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
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: AppColors.text.inverse,
    marginLeft: 12,
  },
  searchIcon: {
    fontSize: 20,
    color: AppColors.text.inverse,
  },
  filtersContainer: {
    marginTop: 12,
    marginBottom: 8,
    maxHeight: 44,
  },
  filtersContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: AppColors.border.medium,
    shadowColor: AppColors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 32,
  },
  activeFilterChip: {
    backgroundColor: AppColors.primary.main,
    borderColor: AppColors.primary.main,
    shadowColor: AppColors.primary.main,
    shadowOpacity: 0.3,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.text.secondary,
  },
  activeFilterText: {
    color: AppColors.text.inverse,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: AppColors.text.secondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  providersContainer: {
    paddingBottom: 20,
  },
  providerCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: AppColors.border.light,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  providerTitle: {
    fontSize: 12,
    color: AppColors.text.secondary,
    marginBottom: 2,
  },
  providerSpecialty: {
    fontSize: 13,
    color: AppColors.primary.main,
    fontWeight: '600',
  },
  providerMeta: {
    alignItems: 'center',
  },
  typeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeIcon: {
    fontSize: 16,
  },
  providerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: AppColors.background.primary,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: AppColors.text.tertiary,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginRight: 2,
  },
  stars: {
    fontSize: 10,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.text.primary,
  },
  availabilitySection: {
    marginBottom: 12,
  },
  availabilityLabel: {
    fontSize: 12,
    color: AppColors.text.secondary,
    marginBottom: 2,
  },
  hospitalName: {
    fontSize: 12,
    color: AppColors.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  nextAvailable: {
    fontSize: 12,
    color: AppColors.status.success,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  profileButton: {
    flex: 1,
    backgroundColor: AppColors.neutral.gray100,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  profileButtonText: {
    color: AppColors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookButton: {
    flex: 1,
    backgroundColor: AppColors.primary.main,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: AppColors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SchedulePage;