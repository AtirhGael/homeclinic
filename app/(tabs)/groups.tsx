import { AppColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
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

interface GroupMessage {
  id: string;
  text: string;
  time: string;
  sender: string;
}

interface HealthGroup {
  id: string;
  name: string;
  topic: string;
  memberCount: number;
  description: string;
  color: [string, string];
  icon: string;
  isPrivate: boolean;
  lastMessage: GroupMessage;
  unreadCount: number;
  tags: string[];
}

const GroupsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const healthGroups: HealthGroup[] = [
    {
      id: '1',
      name: 'Sexual Health & Wellness',
      topic: 'Sexual Health',
      memberCount: 2847,
      description: 'Safe space to discuss sexual health, relationships, and intimacy with healthcare professionals and peers.',
      color: [AppColors.medical.heart, AppColors.primary.main],
      icon: '💗',
      isPrivate: true,
      lastMessage: {
        id: '1',
        text: 'Dr. Sarah: Remember, regular STI testing is important for sexually active individuals...',
        time: '2 min ago',
        sender: 'Dr. Sarah Johnson'
      },
      unreadCount: 3,
      tags: ['Sexual Health', 'Relationships', 'STI Prevention']
    },
    {
      id: '2',
      name: 'Pregnancy & Maternity',
      topic: 'Pregnancy',
      memberCount: 1523,
      description: 'Support group for expecting mothers, sharing experiences, tips, and professional advice throughout your pregnancy journey.',
      color: [AppColors.secondary.main, AppColors.secondary.light],
      icon: '🤱',
      isPrivate: false,
      lastMessage: {
        id: '2',
        text: 'Maria: Just felt the first kicks today! So exciting 😊',
        time: '5 min ago',
        sender: 'Maria Garcia'
      },
      unreadCount: 7,
      tags: ['Pregnancy', 'Prenatal Care', 'New Mothers']
    },
    {
      id: '3',
      name: 'Mental Health Support',
      topic: 'Mental Health',
      memberCount: 3102,
      description: 'Mental health support, anxiety management, depression resources, and therapy discussions with qualified professionals.',
      color: [AppColors.medical.brain, AppColors.primary.dark],
      icon: '🧠',
      isPrivate: false,
      lastMessage: {
        id: '3',
        text: 'Anonymous: Meditation has really helped with my anxiety. Here\'s what worked...',
        time: '12 min ago',
        sender: 'Anonymous User'
      },
      unreadCount: 12,
      tags: ['Mental Health', 'Anxiety', 'Depression', 'Therapy']
    },
    {
      id: '4',
      name: 'Women\'s Health Hub',
      topic: 'Women\'s Health',
      memberCount: 2156,
      description: 'Comprehensive discussions about reproductive health, menstrual health, and women-specific medical concerns.',
      color: [AppColors.status.info, AppColors.primary.light],
      icon: '👩‍⚕️',
      isPrivate: false,
      lastMessage: {
        id: '4',
        text: 'Dr. Lisa: PCOS management strategies that actually work...',
        time: '18 min ago',
        sender: 'Dr. Lisa Park'
      },
      unreadCount: 1,
      tags: ['Women\'s Health', 'Reproductive Health', 'PCOS']
    },
    {
      id: '5',
      name: 'Men\'s Health Forum',
      topic: 'Men\'s Health',
      memberCount: 1654,
      description: 'Men\'s health issues, fitness, testosterone, prostate health, and emotional wellness discussions.',
      color: [AppColors.neutral.gray700, AppColors.neutral.gray500],
      icon: '�‍⚕️',
      isPrivate: false,
      lastMessage: {
        id: '5',
        text: 'John: Prostate screening saved my life. Don\'t wait guys...',
        time: '25 min ago',
        sender: 'John Williams'
      },
      unreadCount: 0,
      tags: ['Men\'s Health', 'Prostate', 'Fitness']
    },
    {
      id: '6',
      name: 'Teen Health Community',
      topic: 'Adolescent Health',
      memberCount: 847,
      description: 'Safe space for teenagers to discuss puberty, body changes, and health concerns with peer support.',
      color: [AppColors.medical.bone, AppColors.neutral.gray600],
      icon: '�',
      isPrivate: true,
      lastMessage: {
        id: '6',
        text: 'Nurse Amy: It\'s completely normal to have questions about your changing body...',
        time: '32 min ago',
        sender: 'Nurse Amy Davis'
      },
      unreadCount: 5,
      tags: ['Adolescent', 'Puberty', 'Body Changes']
    },
    {
      id: '7',
      name: 'LGBTQ+ Health Circle',
      topic: 'LGBTQ+ Health',
      memberCount: 743,
      description: 'Inclusive healthcare discussions and support for LGBTQ+ community health needs and wellness.',
      color: [AppColors.primary.main, AppColors.primary.dark],
      icon: '🏳️‍🌈',
      isPrivate: true,
      lastMessage: {
        id: '7',
        text: 'Alex: Finding LGBTQ+ friendly healthcare providers in our area...',
        time: '45 min ago',
        sender: 'Alex Rivera'
      },
      unreadCount: 2,
      tags: ['LGBTQ+', 'Inclusive Care', 'Community']
    },
    {
      id: '8',
      name: 'Chronic Illness Support',
      topic: 'Chronic Conditions',
      memberCount: 956,
      description: 'Support and resources for people living with chronic illnesses, sharing experiences and management tips.',
      color: [AppColors.status.warning, '#f59e0b'],
      icon: '🛡️',
      isPrivate: false,
      lastMessage: {
        id: '8',
        text: 'Dr. Mike: New treatment options for autoimmune conditions are now available...',
        time: '1 hour ago',
        sender: 'Dr. Mike Chen'
      },
      unreadCount: 0,
      tags: ['Chronic Illness', 'Treatment', 'Support']
    }
  ];

  const getFilteredGroups = () => {
    let filtered = healthGroups;
    
    if (searchQuery) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const handleGroupPress = (groupId: string) => {
    Alert.alert(
      'Join Group Chat',
      'This will take you to the group conversation. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join', onPress: () => {
          // router.push(`/group-chat/${groupId}`);
          Alert.alert('Success', 'Joined group chat successfully!');
        }}
      ]
    );
  };

  const handleCreateGroup = () => {
    Alert.alert(
      'Create New Health Group',
      'What type of health topic would you like to discuss?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: () => Alert.alert('Feature Coming Soon', 'Group creation will be available in the next update.') }
      ]
    );
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
      {/* Header */}
      <LinearGradient
        colors={AppColors.gradients.primary as [string, string]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Health Communities</Text>
            <Text style={styles.userName}>Join the conversation</Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search health groups, topics..."
            placeholderTextColor={AppColors.text.inverse + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Bar */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {getFilteredGroups().length} health communities available
          </Text>
        </View>

        {/* Groups List */}
        <View style={styles.groupsContainer}>
          {getFilteredGroups().map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              onPress={() => handleGroupPress(group.id)}
            >
              <View style={styles.groupCardContent}>
                <View style={styles.groupHeader}>
                  <View style={[styles.groupIcon, { backgroundColor: group.color[0] + '20' }]}>
                    <Text style={styles.groupIconText}>{group.icon}</Text>
                  </View>
                  <View style={styles.groupInfo}>
                    <View style={styles.groupTitleRow}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      {group.isPrivate && (
                        <View style={styles.privateBadge}>
                          <Text style={styles.privateBadgeText}>🔒</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.groupTopic}>{group.topic}</Text>
                    <View style={styles.groupMetrics}>
                      <Text style={styles.memberCount}>
                        👥 {formatMemberCount(group.memberCount)} members
                      </Text>
                      {group.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{group.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <Text style={styles.groupDescription} numberOfLines={2}>
                  {group.description}
                </Text>

                <View style={styles.lastMessageContainer}>
                  <Text style={styles.lastMessageText} numberOfLines={1}>
                    {group.lastMessage.text}
                  </Text>
                  <Text style={styles.lastMessageTime}>{group.lastMessage.time}</Text>
                </View>

                <View style={styles.tagsContainer}>
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {getFilteredGroups().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No groups found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or browse different categories
            </Text>
          </View>
        )}
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
    paddingTop:50,
    paddingVertical: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: AppColors.text.inverse + 'CC',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.text.inverse + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.text.inverse + '26',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 18,
    color: AppColors.text.inverse,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: AppColors.text.inverse,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: AppColors.text.secondary,
    fontWeight: '500',
  },
  groupsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  groupCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 16,
    marginBottom: 16,
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
  groupCardContent: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 20,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    flex: 1,
  },
  privateBadge: {
    marginLeft: 8,
  },
  privateBadgeText: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  groupTopic: {
    fontSize: 14,
    color: AppColors.primary.main,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: {
    fontSize: 12,
    color: AppColors.text.secondary,
  },
  unreadBadge: {
    backgroundColor: AppColors.status.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    color: AppColors.text.inverse,
    fontWeight: 'bold',
  },
  groupDescription: {
    fontSize: 14,
    color: AppColors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  lastMessageContainer: {
    backgroundColor: AppColors.background.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  lastMessageText: {
    fontSize: 13,
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  lastMessageTime: {
    fontSize: 11,
    color: AppColors.text.tertiary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: AppColors.neutral.gray100,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    color: AppColors.text.secondary,
    fontWeight: '600',
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

export default GroupsScreen;