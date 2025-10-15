import { AppColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
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

const { width, height } = Dimensions.get('window');

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  comment: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

interface PostDetails {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  timeAgo: string;
  content: string;
  fullContent?: string;
  imageCount?: number;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  category: 'health-tip' | 'announcement' | 'research' | 'general';
}

export default function PostDetailsScreen() {
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const [post, setPost] = useState<PostDetails>({
    id: params.postId as string || '1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Cardiologist • 15 years experience',
    doctorAvatar: 'SJ',
    timeAgo: '2 hours ago',
    content: '🫀 Heart Health Tip: Did you know that just 30 minutes of walking daily can reduce your risk of heart disease by 35%?',
    fullContent: `🫀 Heart Health Tip: Did you know that just 30 minutes of walking daily can reduce your risk of heart disease by 35%? 

Start small - even a 10-minute walk after meals makes a difference! Here's why walking is so beneficial for your heart:

🚶‍♀️ **Improves Circulation**: Walking helps pump blood more efficiently throughout your body
💪 **Strengthens Heart Muscle**: Regular walking makes your heart stronger and more efficient
🩸 **Lowers Blood Pressure**: Consistent walking can reduce both systolic and diastolic pressure
🧘‍♀️ **Reduces Stress**: Physical activity releases endorphins and reduces stress hormones

**Getting Started:**
• Week 1-2: 10 minutes after each meal
• Week 3-4: 15 minutes twice daily
• Week 5+: 30 minutes daily (can be split into 2 sessions)

Remember, consistency is key! Even on busy days, a short 5-minute walk is better than nothing.

#HeartHealth #Prevention #WalkingForHealth #CardiovascularHealth`,
    imageCount: 3,
    videoUrl: 'https://example.com/heart-health-video',
    likes: 124,
    comments: 18,
    shares: 12,
    isLiked: false,
    category: 'health-tip',
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userName: 'Maria Garcia',
      userAvatar: 'MG',
      comment: 'Thank you Dr. Johnson! I started walking 2 weeks ago and already feeling more energetic. This is so motivating! 💪',
      timeAgo: '1 hour ago',
      likes: 8,
      isLiked: false,
    },
    {
      id: '2',
      userName: 'James Wilson',
      userAvatar: 'JW',
      comment: 'Great advice! I have a question - is it better to walk before or after meals for heart health?',
      timeAgo: '45 minutes ago',
      likes: 3,
      isLiked: true,
    },
    {
      id: '3',
      userName: 'Dr. Michael Chen',
      userAvatar: 'MC',
      comment: 'Excellent post Sarah! I always recommend this to my patients too. The compound effect of small daily walks is incredible.',
      timeAgo: '30 minutes ago',
      likes: 12,
      isLiked: false,
    },
    {
      id: '4',
      userName: 'Lisa Park',
      userAvatar: 'LP',
      comment: 'Can you share more about heart-healthy foods that complement this exercise routine?',
      timeAgo: '20 minutes ago',
      likes: 5,
      isLiked: false,
    },
  ]);

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

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }));
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked
            }
          : comment
      )
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be available soon!');
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        userName: 'You',
        userAvatar: 'YU',
        comment: commentText.trim(),
        timeAgo: 'Just now',
        likes: 0,
        isLiked: false,
      };
      
      setComments(prev => [newComment, ...prev]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
      setCommentText('');
      setIsCommenting(false);
      
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePlayVideo = () => {
    Alert.alert('Video Player', 'Video player will be integrated in the next update!');
  };

  const handleViewImage = () => {
    Alert.alert('Image Viewer', 'Image gallery will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      > 
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Details</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          {/* Post Content */}
          <View style={styles.postContainer}>
            <View style={styles.doctorHeader}>
              <View style={styles.doctorInfo}>
                <View style={styles.doctorAvatar}>
                  <Text style={styles.avatarText}>{post.doctorAvatar}</Text>
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{post.doctorName}</Text>
                  <Text style={styles.doctorSpecialty}>{post.doctorSpecialty}</Text>
                  <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                </View>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(post.category)}</Text>
              </View>
            </View>

            {/* Full Content */}
            <Text style={styles.fullContent}>{post.fullContent || post.content}</Text>

            {/* Media Section */}
            {post.videoUrl && (
              <TouchableOpacity style={styles.videoContainer} onPress={handlePlayVideo}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                  style={styles.videoOverlay}
                >
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶️</Text>
                  </View>
                  <Text style={styles.videoText}>Tap to play video</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {post.imageCount && (
              <TouchableOpacity style={styles.imageContainer} onPress={handleViewImage}>
                <Text style={styles.imageText}>📷 View {post.imageCount} image{post.imageCount > 1 ? 's' : ''}</Text>
              </TouchableOpacity>
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity 
                style={[styles.actionButton, post.isLiked && styles.likedButton]}
                onPress={handleLike}
              >
                <Text style={styles.actionIcon}>
                  {post.isLiked ? '❤️' : '🤍'}
                </Text>
                <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsCommenting(!isCommenting)}
              >
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionText}>{post.shares}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
            
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentUser}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>{comment.userAvatar}</Text>
                    </View>
                    <View style={styles.commentUserInfo}>
                      <Text style={styles.commentUserName}>{comment.userName}</Text>
                      <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.commentLikeButton}
                    onPress={() => handleCommentLike(comment.id)}
                  >
                    <Text style={styles.commentLikeIcon}>
                      {comment.isLiked ? '❤️' : '🤍'}
                    </Text>
                    <Text style={[styles.commentLikeText, comment.isLiked && styles.commentLikedText]}>
                      {comment.likes}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputWrapper}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={AppColors.text.tertiary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
              onFocus={() => setIsCommenting(true)}
            />
            <TouchableOpacity 
              style={[styles.sendButton, commentText.trim() && styles.sendButtonActive]}
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Text style={[styles.sendIcon, commentText.trim() && styles.sendIconActive]}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
          {isCommenting && (
            <Text style={styles.characterCount}>
              {commentText.length}/500
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: AppColors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border.light,
    marginTop: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: AppColors.text.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: 18,
    color: AppColors.text.primary,
  },
  content: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: AppColors.background.secondary,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.text.primary,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: AppColors.text.secondary,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: AppColors.text.tertiary,
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 18,
  },
  fullContent: {
    fontSize: 16,
    lineHeight: 24,
    color: AppColors.text.primary,
    marginBottom: 20,
  },
  videoContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: AppColors.neutral.gray800,
    marginBottom: 16,
  },
  videoOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  playIcon: {
    fontSize: 24,
  },
  videoText: {
    color: AppColors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    backgroundColor: AppColors.neutral.gray100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  imageText: {
    fontSize: 14,
    color: AppColors.text.secondary,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.border.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: AppColors.neutral.gray50,
  },
  likedButton: {
    backgroundColor: '#fef2f2',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text.secondary,
  },
  likedText: {
    color: AppColors.medical.heart,
  },
  commentsSection: {
    backgroundColor: AppColors.background.secondary,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: AppColors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 16,
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border.light,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.text.primary,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
    color: AppColors.text.tertiary,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: AppColors.neutral.gray50,
  },
  commentLikeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  commentLikeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.text.secondary,
  },
  commentLikedText: {
    color: AppColors.medical.heart,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: AppColors.text.primary,
  },
  commentInputContainer: {
    backgroundColor: AppColors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: AppColors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area bottom padding
    marginTop: 'auto', // Push to bottom
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: AppColors.background.primary,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: AppColors.text.primary,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: AppColors.status.info,
  },
  sendIcon: {
    fontSize: 16,
    color: AppColors.text.tertiary,
  },
  sendIconActive: {
    color: AppColors.text.inverse,
  },
  characterCount: {
    fontSize: 12,
    color: AppColors.text.tertiary,
    textAlign: 'right',
    marginTop: 4,
  },
});