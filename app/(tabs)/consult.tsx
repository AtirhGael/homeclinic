import { AppColors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Consultation {
  id: string;
  patientName: string;
  patientAge: number;
  type: 'video' | 'audio' | 'chat' | 'in-person';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  time: string;
  duration: number;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  department: string;
}

const ConsultScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'history'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock consultations data
  const consultations: Consultation[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientAge: 34,
      type: 'video',
      status: 'scheduled',
      time: '14:30',
      duration: 30,
      description: 'Follow-up for diabetes management',
      urgency: 'medium',
      department: 'Endocrinology',
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientAge: 45,
      type: 'in-person',
      status: 'ongoing',
      time: '13:00',
      duration: 45,
      description: 'Cardiac consultation',
      urgency: 'high',
      department: 'Cardiology',
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      patientAge: 28,
      type: 'chat',
      status: 'completed',
      time: '11:30',
      duration: 20,
      description: 'General health inquiry',
      urgency: 'low',
      department: 'General Medicine',
    },
    {
      id: '4',
      patientName: 'Robert Wilson',
      patientAge: 52,
      type: 'video',
      status: 'scheduled',
      time: '16:00',
      duration: 60,
      description: 'Post-surgery consultation',
      urgency: 'high',
      department: 'Surgery',
    },
  ];

  const getFilteredConsultations = () => {
    let filtered = consultations;
    
    switch (activeTab) {
      case 'upcoming':
        filtered = consultations.filter(c => c.status === 'scheduled');
        break;
      case 'ongoing':
        filtered = consultations.filter(c => c.status === 'ongoing');
        break;
      case 'history':
        filtered = consultations.filter(c => c.status === 'completed' || c.status === 'cancelled');
        break;
    }
    
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '📹';
      case 'audio': return '📞';
      case 'chat': return '💬';
      case 'in-person': return '🏥';
      default: return '📋';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return AppColors.status.error;
      case 'medium': return AppColors.status.warning;
      case 'low': return AppColors.status.success;
      default: return AppColors.neutral.gray500;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return AppColors.status.info;
      case 'ongoing': return AppColors.status.success;
      case 'completed': return AppColors.neutral.gray500;
      case 'cancelled': return AppColors.status.error;
      default: return AppColors.neutral.gray500;
    }
  };

  const handleStartConsultation = (consultation: Consultation) => {
    Alert.alert(
      'Start Consultation',
      `Start ${consultation.type} consultation with ${consultation.patientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // Here you would integrate with your video/audio calling service
            Alert.alert('Starting...', 'Connecting to consultation platform...');
          }
        },
      ]
    );
  };

  const handleScheduleConsultation = () => {
     router.push({
          pathname: '/pages/schedule',
        //   params: { postId }
        });
  };

  const handleEmergencyConsult = () => {
    Alert.alert(
      'Emergency Consultation',
      'Connecting you to emergency consultation team...',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right',]}>
      {/* Header */}
      <LinearGradient
        colors={AppColors.gradients.primary as [string, string]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Consultations</Text>
            <Text style={styles.userName}>Manage Your Sessions</Text>
          </View>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={handleEmergencyConsult}
          >
            <Text style={styles.emergencyIcon}>🚨</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients or departments..."
            placeholderTextColor={AppColors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={handleScheduleConsultation}
            >
              <View style={[styles.actionIcon, { backgroundColor: AppColors.primary['50'] }]}>
                <Text style={styles.actionIconText}>📅</Text>
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={handleEmergencyConsult}
            >
              <View style={[styles.actionIcon, { backgroundColor: AppColors.status.error + '20' }]}>
                <Text style={styles.actionIconText}>🚨</Text>
              </View>
              <Text style={styles.actionText}>Emergency</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.actionIcon, { backgroundColor: AppColors.primary['50'] }]}>
                <Text style={styles.actionIconText}>📹</Text>
              </View>
              <Text style={styles.actionText}>Video Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.actionIcon, { backgroundColor: AppColors.secondary['50'] }]}>
                <Text style={styles.actionIconText}>💬</Text>
              </View>
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
            onPress={() => setActiveTab('ongoing')}
          >
            <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Consultations List */}
        <View style={styles.consultationsContainer}>
          {getFilteredConsultations().map((consultation) => (
            <View key={consultation.id} style={styles.consultationCard}>
              <View style={styles.consultationHeader}>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{consultation.patientName}</Text>
                  <Text style={styles.patientAge}>Age: {consultation.patientAge}</Text>
                </View>
                <View style={styles.consultationMeta}>
                  <View 
                    style={[
                      styles.urgencyBadge, 
                      { backgroundColor: getUrgencyColor(consultation.urgency) }
                    ]}
                  >
                    <Text style={styles.urgencyText}>
                      {consultation.urgency.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.typeIcon}>
                    {getTypeIcon(consultation.type)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.consultationDetails}>
                <Text style={styles.description}>{consultation.description}</Text>
                <Text style={styles.department}>{consultation.department}</Text>
                
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>⏰ {consultation.time}</Text>
                  <Text style={styles.duration}>⏱️ {consultation.duration} min</Text>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(consultation.status) }
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {consultation.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              
              {consultation.status === 'scheduled' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={() => handleStartConsultation(consultation)}
                  >
                    <Text style={styles.startButtonText}>Start Consultation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {consultation.status === 'ongoing' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.endButton}>
                    <Text style={styles.endButtonText}>End Session</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          {getFilteredConsultations().length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Consultations</Text>
              <Text style={styles.emptySubtitle}>
                No consultations found for this category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: AppColors.text.inverse + 'CC',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  emergencyButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppColors.text.inverse + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 24,
  },
  searchContainer: {
    backgroundColor: AppColors.text.inverse + '26',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 50,
    color: AppColors.text.inverse,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 60) / 2,
    backgroundColor: AppColors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.text.primary,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.background.secondary,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: AppColors.primary.main,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text.secondary,
  },
  activeTabText: {
    color: AppColors.text.inverse,
  },
  consultationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  consultationCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  consultationMeta: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  typeIcon: {
    fontSize: 24,
  },
  consultationDetails: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: AppColors.text.primary,
    marginBottom: 8,
    lineHeight: 20,
  },
  department: {
    fontSize: 12,
    color: AppColors.text.secondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  time: {
    fontSize: 12,
    color: AppColors.text.primary,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
    color: AppColors.text.primary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: AppColors.status.success,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: AppColors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: AppColors.neutral.gray100,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: AppColors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  joinButton: {
    flex: 1,
    backgroundColor: AppColors.status.info,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: AppColors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  endButton: {
    flex: 1,
    backgroundColor: AppColors.status.error,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  endButtonText: {
    color: AppColors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
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
  },
});

export default ConsultScreen;