import { AppColors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signOut } from '@/store/slice/authSlice';
import { getUser, updateUserById, updateUserProfilePicture } from '@/store/slice/userSlice';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigation' | 'action' | 'info';
  value?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  action?: () => void;
}

const SettingsScreen = () => {
  const { id: userId } = useAppSelector((state) => state.auth);
  const { user: displayUser, isLoading: userLoading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState({
    name: displayUser?.fullname || '',
    email: displayUser?.email || '',
    phone: displayUser?.phone || displayUser?.whatsappNum || '',
    about: displayUser?.about || '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && !displayUser) {
        await dispatch(getUser(userId));
      }
    };
    fetchUserData();
    setTempUserData({
      name: displayUser?.fullname || '',
      email: displayUser?.email || '',
      phone: displayUser?.phone || displayUser?.whatsappNum || '',
      about: displayUser?.about || '',
    });
  }, [displayUser, userId, dispatch]);

  const handleRefreshUserData = () => {
    if (userId) {
      dispatch(getUser(userId));
    }
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access photo library is required!');
        return;
      }

      // Show options for camera or gallery
      Alert.alert(
        'Select Profile Picture',
        'Choose how you want to update your profile picture',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Camera', 
            onPress: () => openCamera() 
          },
          { 
            text: 'Gallery', 
            onPress: () => openGallery() 
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to access photo library');
    }
  };

  const openCamera = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleImageSelected(result.assets[0]);
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleImageSelected = async (imageAsset: ImagePicker.ImagePickerAsset) => {
    try {
      if (!userId || !displayUser) {
        Alert.alert('Error', 'User information not available');
        return;
      }

      const updatedUser = {
        ...displayUser,
        profilePicture: imageAsset.uri,
      };

      await dispatch(updateUserProfilePicture(updatedUser));
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => dispatch(signOut()),
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    try {
      if (!userId || !displayUser) {
        Alert.alert('Error', 'User information not available');
        return;
      }

      const updatedUser = {
        ...displayUser,
        fullname: tempUserData.name,
        email: tempUserData.email,
        phone: tempUserData.phone,
        about: tempUserData.about,
      };

      await dispatch(updateUserById(updatedUser));
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature will redirect you to the password change screen.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'This would open the privacy policy document.',
      [{ text: 'OK' }]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'This would open the terms of service document.',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Email: support@homeclinic.com\nPhone: +1 (555) 123-4567',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About HomeClinic',
      'Version 1.0.0\nA comprehensive hospital management application for healthcare professionals.',
      [{ text: 'OK' }]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          description: 'Update your personal information',
          type: 'action' as const,
          icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
          action: () => setIsEditing(!isEditing),
        },
        {
          id: 'password',
          title: 'Change Password',
          description: 'Update your account password',
          type: 'action' as const,
          icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
          action: handleChangePassword,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          description: 'Receive notifications for appointments and messages',
          type: 'toggle' as const,
          icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
          value: notifications,
        },
        {
          id: 'biometric',
          title: 'Biometric Login',
          description: 'Use fingerprint or face ID to login',
          type: 'toggle' as const,
          icon: 'finger-print-outline' as keyof typeof Ionicons.glyphMap,
          value: biometric,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'toggle' as const,
          icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
          value: darkMode,
        },
        {
          id: 'autoBackup',
          title: 'Auto Backup',
          description: 'Automatically backup your data',
          type: 'toggle' as const,
          icon: 'cloud-upload-outline' as keyof typeof Ionicons.glyphMap,
          value: autoBackup,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          description: 'Get help and support',
          type: 'navigation' as const,
          icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
          action: handleContactSupport,
        },
        {
          id: 'contact',
          title: 'Contact Support',
          description: 'Reach out to our support team',
          type: 'navigation' as const,
          icon: 'call-outline' as keyof typeof Ionicons.glyphMap,
          action: handleContactSupport,
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Help us improve the app',
          type: 'navigation' as const,
          icon: 'chatbubble-outline' as keyof typeof Ionicons.glyphMap,
          action: () => Alert.alert('Feedback', 'Thank you for your feedback!'),
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy',
          title: 'Privacy Policy',
          type: 'navigation' as const,
          icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
          action: handlePrivacyPolicy,
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          type: 'navigation' as const,
          icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
          action: handleTermsOfService,
        },
        {
          id: 'about',
          title: 'About',
          type: 'navigation' as const,
          icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
          action: handleAbout,
        },
      ],
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'biometric':
        setBiometric(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'autoBackup':
        setAutoBackup(value);
        break;
    }
  };

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.action}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon} size={24} color={AppColors.primary.main} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={(value) => handleToggle(item.id, value)}
              trackColor={{ false: AppColors.border.light, true: AppColors.primary.main }}
              thumbColor={item.value ? AppColors.text.inverse : AppColors.neutral.gray100}
            />
          )}
          {item.type === 'navigation' && (
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[AppColors.gradients.cool[0], AppColors.gradients.cool[1]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Settings</Text>
            <Text style={styles.userName}>Customize Your Experience</Text>
          </View>
          <View style={styles.profileIcon}>
            {userLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : displayUser?.profilePicture ? (
              <Image 
                source={{ uri: displayUser.profilePicture }} 
                style={styles.headerProfileImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.profileText}>
                {displayUser?.fullname?.charAt(0)?.toUpperCase() || ''}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.userAvatarContainer}>
              <View style={styles.userAvatar}>
                {userLoading ? (
                  <ActivityIndicator size="small" color={AppColors.primary.main} />
                ) : displayUser?.profilePicture ? (
                  <Image 
                    source={{ uri: displayUser.profilePicture }} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {displayUser?.fullname?.charAt(0)?.toUpperCase() || displayUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={handleImagePicker}
                disabled={userLoading}
              >
                <Ionicons name="camera-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              {userLoading ? (
                <View style={styles.loadingUserInfo}>
                  <ActivityIndicator size="small" color={AppColors.text.secondary} />
                  <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.userNameText}>
                    {displayUser?.fullname || displayUser?.username || 'User'}
                  </Text>
                  <Text style={styles.userEmailText}>
                    {displayUser?.email || 'user@example.com'}
                  </Text>
                  {/* <Text style={styles.userRoleText}>Patient</Text> */}
                  {(displayUser?.phone || displayUser?.whatsappNum) && (
                    <View style={styles.contactRow}>
                      <Ionicons name="call-outline" size={14} color="#6b7280" />
                      <Text style={styles.userPhoneText}>
                        {displayUser?.phone || displayUser?.whatsappNum}
                      </Text>
                    </View>
                  )}
                  {displayUser?.address && (
                    <View style={styles.contactRow}>
                      <Ionicons name="location-outline" size={14} color="#6b7280" />
                      <Text style={styles.userAddressText}>
                        {displayUser.address}
                      </Text>
                    </View>
                  )}
                  {displayUser?.about && (
                    <View style={styles.aboutSection}>
                      <Text style={styles.aboutText} numberOfLines={2}>
                        {displayUser.about}
                      </Text>
                    </View>
                  )}
                  {displayUser?.balance !== null && displayUser?.balance !== undefined && (
                    <View style={styles.balanceSection}>
                      <Text style={styles.balanceLabel}>Balance:</Text>
                      <Text style={styles.balanceAmount}>${displayUser.balance || 0}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefreshUserData}
              disabled={userLoading}
            >
              <Ionicons name="refresh-outline" size={16} color={AppColors.primary.main} />
            </TouchableOpacity>
          </View>

          {isEditing && (
            <View style={styles.editProfileForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempUserData.name}
                  onChangeText={(text) => setTempUserData({ ...tempUserData, name: text })}
                  placeholder="Enter your full name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempUserData.email}
                  onChangeText={(text) => setTempUserData({ ...tempUserData, email: text })}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempUserData.phone}
                  onChangeText={(text) => setTempUserData({ ...tempUserData, phone: text })}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>About</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={tempUserData.about}
                  onChangeText={(text) => setTempUserData({ ...tempUserData, about: text })}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.title} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsCard}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {index < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.signOutIcon} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>HomeClinic v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
  },
  userInfo: {
    flex: 1,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  userRoleText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userPhoneText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userAddressText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  aboutSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  balanceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 16,
    color: '#059669',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  editProfileForm: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  settingAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 72,
  },
  signOutSection: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default SettingsScreen;