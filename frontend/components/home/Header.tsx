import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';
import { getGreeting, getMoneyMood } from '../../utils/format';

interface HeaderProps {
  userName: string;
  spendPercentage?: number;
}

export function Header({ userName, spendPercentage = 50 }: HeaderProps) {
  const greeting = getGreeting();
  const mood = getMoneyMood(spendPercentage);
  
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
      </View>
      
      <View style={styles.right}>
        <View style={[styles.moodPill, { backgroundColor: mood.color + '20' }]}>
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={[styles.moodText, { color: mood.color }]}>{mood.text}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  greetingContainer: {
    gap: 2,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  moodEmoji: {
    fontSize: 12,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
});