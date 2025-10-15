import { AppColors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  // StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

interface Post {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  timeAgo: string;
  content: string;
  imageCount?: number;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  category: 'health-tip' | 'announcement' | 'research' | 'general';
}

export default function HomeScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Cardiologist',
      doctorAvatar: 'SJ',
      timeAgo: '2 hours ago',
      content: '🫀 Heart Health Tip: Did you know that just 30 minutes of walking daily can reduce your risk of heart disease by 35%? Start small - even a 10-minute walk after meals makes a difference! #HeartHealth #Prevention',
      likes: 124,
      comments: 18,
      shares: 12,
      isLiked: false,
      category: 'health-tip',
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'Pediatrician',
      doctorAvatar: 'MC',
      timeAgo: '4 hours ago',
      content: '📢 Important Update: Our pediatric clinic will be offering extended hours on weekends starting next month. Book your appointments early! We\'re here to make healthcare more accessible for your little ones. 👶',
      imageCount: 2,
      likes: 89,
      comments: 25,
      shares: 8,
      isLiked: true,
      category: 'announcement',
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialty: 'Nutritionist',
      doctorAvatar: 'ER',
      timeAgo: '6 hours ago',
      content: '🥗 Nutrition Facts: Incorporating colorful vegetables in your diet isn\'t just visually appealing - each color represents different nutrients! Red tomatoes (lycopene), orange carrots (beta-carotene), green spinach (iron & folate). Eat the rainbow! 🌈',
      likes: 156,
      comments: 32,
      shares: 24,
      isLiked: false,
      category: 'health-tip',
    },
    {
      id: '4',
      doctorName: 'Dr. James Wilson',
      doctorSpecialty: 'Orthopedic Surgeon',
      doctorAvatar: 'JW',
      timeAgo: '8 hours ago',
      content: '🔬 Latest Research: New minimally invasive techniques for joint replacement are showing 40% faster recovery times. Excited to implement these innovations in our practice. The future of orthopedic surgery is here!',
      imageCount: 1,
      likes: 78,
      comments: 15,
      shares: 19,
      isLiked: false,
      category: 'research',
    },
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health-tip': return AppColors.secondary.main;
      case 'announcement': return AppColors.status.info;
      case 'research': return AppColors.primary.main;
      default: return AppColors.neutral.gray500;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health-tip': return '💡';
      case 'announcement': return '📢';
      case 'research': return '🔬';
      default: return '📝';
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked 
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    handleViewPost(postId); // Navigate to post details to see comments
  };

  const handleShare = (postId: string) => {
    Alert.alert('Share', 'Share feature will be available soon!');
  };

  const handleSearch = () => {
    Alert.alert('Search', `Searching for: ${searchQuery}`);
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'You have 3 new notifications');
  };

  const handleViewPost = (postId: string) => {
    router.push({
      pathname: '/post-details',
      params: { postId }
    });
  };

  const PostCard = ({ post }: { post: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.doctorInfo}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.avatarText}>{post.doctorAvatar}</Text>
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{post.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{post.doctorSpecialty}</Text>
          </View>
        </View>
        <View style={styles.postMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(post.category)}</Text>
          </View>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>
      </View>

      {/* Post Content - Clickable to view details */}
      <TouchableOpacity onPress={() => handleViewPost(post.id)} activeOpacity={0.8}>
        <Text style={styles.postContent}>{post.content}</Text>
        
        {/* Image Indicator */}
        {post.imageCount && (
          <View style={styles.imageIndicator}>
            <Text style={styles.imageText}>📷 {post.imageCount} image{post.imageCount > 1 ? 's' : ''}</Text>
          </View>
        )}
        
        {/* View Details Indicator */}
        <Text style={styles.viewDetailsText}>Tap to view full story →</Text>
      </TouchableOpacity>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={[styles.actionButton, post.isLiked && styles.likedButton]}
          onPress={() => handleLike(post.id)}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleComment(post.id)}
        >
          <Text style={styles.actionIcon}>�</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleShare(post.id)}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
      <StatusBar style='dark' />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={AppColors.gradients.cool as [string, string]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>{getGreeting()}!</Text>
              <Text style={styles.userName}>Welcome back, {user?.username || 'User'}</Text>
              <Text style={styles.subtitle}>Stay updated with the latest health insights</Text>
            </View>
            <View style={styles.headerActions}>
             
              <TouchableOpacity style={styles.headerButton} onPress={handleNotifications}>
                <Text style={styles.headerButtonIcon}>🔔</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search health topics, doctors..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonIcon}>🔍</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.feedContainer}>
          <Text style={styles.feedTitle}>Health Community Feed</Text>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>

        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More Posts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '600',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerButtonIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppColors.medical.emergency,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: AppColors.text.inverse,
    fontSize: 16,
    paddingRight: 12,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonIcon: {
    fontSize: 16,
  },
  feedContainer: {
    padding: 20,
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 20,
  },
  postCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 16,
  },
  timeAgo: {
    fontSize: 12,
    color: AppColors.text.tertiary,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  viewDetailsText: {
    fontSize: 12,
    color: AppColors.text.link,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  imageIndicator: {
    backgroundColor: AppColors.neutral.gray100,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  imageText: {
    fontSize: 12,
    color: AppColors.text.secondary,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: AppColors.neutral.gray50,
  },
  likedButton: {
    backgroundColor: '#fef2f2',
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  likedIcon: {
    // No additional styling needed, emoji handles color
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text.secondary,
  },
  likedText: {
    color: AppColors.medical.heart,
  },
  loadMoreContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  loadMoreButton: {
    backgroundColor: AppColors.status.info,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    color: AppColors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
