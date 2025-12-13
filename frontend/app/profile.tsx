import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen() {
  const { user } = useAppStore();
  const [hinglishMode, setHinglishMode] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'M'}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Mohit'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'mohit@example.com'}</Text>
          <Text style={styles.profileLocation}>
            <Ionicons name="location" size={14} color={COLORS.textSecondary} />
            {' '}{user?.location || 'Bangalore'}
          </Text>
        </View>

        {/* Settings */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>PREFERENCES</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="language" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Hinglish Mode</Text>
              </View>
              <Switch
                value={hinglishMode}
                onValueChange={setHinglishMode}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
                thumbColor={hinglishMode ? COLORS.primary : COLORS.surface}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="moon" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
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

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.surface,
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
  profileLocation: {
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 64,
  },
  bottomPadding: {
    height: 80,
  },
});
