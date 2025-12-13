import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINRFull } from '../../utils/format';

interface BudgetCardProps {
  budget: number;
  spent: number;
}

export function BudgetCard({ budget, spent }: BudgetCardProps) {
  const remaining = budget - spent;
  const spentPercentage = (spent / budget) * 100;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: spentPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [spentPercentage]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>Total Monthly Budget</Text>
        </View>

        {/* Budget Amount */}
        <Text style={styles.budgetAmount}>{formatINRFull(budget)}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
              <LinearGradient
                colors={['#966866', '#B08886']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{Math.round(spentPercentage)}% Spent</Text>
            <Text style={styles.statValue}>{formatINRFull(spent)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {formatINRFull(remaining)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="add" size={18} color={COLORS.surface} />
            <Text style={styles.primaryButtonText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Edit Limits</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B8B8D0',
  },
  budgetAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.surface,
    letterSpacing: -1,
  },
  progressContainer: {
    marginVertical: SPACING.xs,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#3D3D5C',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B8B8D0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.surface,
  },
  divider: {
    width: 1,
    backgroundColor: '#3D3D5C',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D3D5C',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
