import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { api } from '../utils/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { reset: resetAppStore } = useAppStore();
  const [darkMode, setDarkMode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              console.log('Starting logout process...');
              
              // Show splash for 2 seconds then logout
              setTimeout(async () => {
                try {
                  console.log('Clearing auth data...');
                  
                  // Clear app store
                  resetAppStore();
                  console.log('App store cleared');
                  
                  // Clear auth context and async storage
                  await logout();
                  console.log('Auth data cleared, navigating to auth screen...');
                  
                  setLoggingOut(false);
                  
                  // Force navigation after a small delay
                  setTimeout(() => {
                    router.replace('/auth');
                  }, 100);
                } catch (error) {
                  console.error('Logout error:', error);
                  setLoggingOut(false);
                  Alert.alert('Error', 'Failed to logout. Please try again.');
                }
              }, 2000);
            } catch (error) {
              console.error('Error starting logout:', error);
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleDisableAccount = () => {
    Alert.alert(
      'Disable Account',
      'Your account will be put in hibernation mode. All your data will be preserved but activities will be stopped. You can reactivate anytime by logging in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setLoading(true);
            try {
              const response = await api.disableAccount(user._id);
              if (response.status === 'success') {
                Alert.alert('Success', 'Account disabled successfully', [
                  { text: 'OK', onPress: handleLogout },
                ]);
              } else {
                Alert.alert('Error', response.detail || 'Failed to disable account');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to disable account');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data including transactions, bank accounts, goals, and chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Double confirmation for delete
            Alert.alert(
              'Are you absolutely sure?',
              'Type "DELETE" to confirm permanent deletion of your account',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    if (!user) return;
                    setLoading(true);
                    try {
                      const response = await api.deleteAccount(user._id);
                      if (response.status === 'success') {
                        Alert.alert('Account Deleted', 'Your account has been permanently deleted', [
                          { text: 'OK', onPress: handleLogout },
                        ]);
                      } else {
                        Alert.alert('Error', response.detail || 'Failed to delete account');
                      }
                    } catch (error: any) {
                      Alert.alert('Error', error.message || 'Failed to delete account');
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Splash Screen Modal during Logout
  if (loggingOut) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <Ionicons name="wallet" size={64} color={COLORS.primary} />
          <Text style={styles.splashText}>See you soon! 👋</Text>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Me</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          {user?.phone && (
            <Text style={styles.profilePhone}>
              <Ionicons name="call" size={14} color={COLORS.textSecondary} />
              {' '}{user.phone}
            </Text>
          )}
        </View>

        {/* Dark Mode */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>APPEARANCE</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="moon" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Coming soon</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
                thumbColor={darkMode ? COLORS.primary : COLORS.surface}
              />
            </View>
          </View>
        </View>

        {/* Settings & Actions */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>SETTINGS</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowSettingsModal(true)}
            >
              <View style={styles.settingIcon}>
                <Ionicons name="settings" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => setShowAboutModal(true), 300);
                }}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.optionText}>About Us</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowSettingsModal(false);
                  setTimeout(handleDisableAccount, 300);
                }}
                disabled={loading}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="pause-circle" size={24} color="#FF9500" />
                </View>
                <Text style={[styles.optionText, { color: '#FF9500' }]}>Disable Account</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowSettingsModal(false);
                  setTimeout(handleDeleteAccount, 300);
                }}
                disabled={loading}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                </View>
                <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Account</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* About Us Modal */}
      <Modal
        visible={showAboutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aboutModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Fibby</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.aboutScrollView}>
              <View style={styles.aboutIconContainer}>
                <Ionicons name="wallet" size={56} color={COLORS.primary} />
              </View>
              <Text style={styles.aboutTitle}>Your Gen-Z Finance Companion</Text>
              <Text style={styles.aboutText}>
                Fibby is your personal AI-powered financial assistant designed specifically for the modern generation. 
                {'\n\n'}
                We help you track expenses, set and achieve financial goals, manage investments, and make smarter money decisions - all in one place.
                {'\n\n'}
                <Text style={styles.aboutBold}>What makes Fibby special?</Text>
                {'\n'}
                • AI-powered insights and recommendations
                {'\n'}
                • Real-time expense tracking
                {'\n'}
                • Goal-based savings
                {'\n'}
                • Investment portfolio management
                {'\n'}
                • Natural language chat interface
                {'\n'}
                • Secure bank account integration
                {'\n\n'}
                <Text style={styles.aboutBold}>Our Mission:</Text>
                {'\n'}
                To make financial literacy accessible and managing money effortless for everyone. We believe that good financial habits start with the right tools and guidance.
                {'\n\n'}
                <Text style={styles.aboutSmall}>Version 1.0.0</Text>
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileEmail: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  profilePhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  settingsGroup: {
    marginBottom: SPACING.lg,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 4,
    borderRadius: RADIUS.lg,
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 80,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalBody: {
    padding: SPACING.md,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  // About Modal
  aboutModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xl * 3,
    maxHeight: '80%',
  },
  aboutScrollView: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  aboutIconContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  aboutText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  aboutBold: {
    fontWeight: '600',
    color: COLORS.text,
  },
  aboutSmall: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  // Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  splashText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
});
