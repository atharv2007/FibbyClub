import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../constants/theme';

interface CategoryIconProps {
  category: string;
  size?: number;
  color?: string;
}

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Food & Dining': 'restaurant',
  'Shopping': 'cart',
  'Transport': 'car',
  'Entertainment': 'film',
  'Utilities': 'bulb',
  'Healthcare': 'medical',
  'Education': 'school',
  'Subscriptions': 'repeat',
  'Groceries': 'basket',
  'Fitness': 'fitness',
  'Travel': 'airplane',
  'EMI': 'card',
  'Salary': 'cash',
  default: 'wallet',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#F59E0B',
  'Shopping': '#EC4899',
  'Transport': '#3B82F6',
  'Entertainment': '#8B5CF6',
  'Utilities': '#10B981',
  'Healthcare': '#EF4444',
  'Education': '#6366F1',
  'Subscriptions': '#F97316',
  'Groceries': '#22C55E',
  'Fitness': '#14B8A6',
  'Travel': '#06B6D4',
  'EMI': '#DC2626',
  'Salary': '#10B981',
  default: COLORS.primary,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 40, color }) => {
  const iconName = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  const backgroundColor = color || CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: backgroundColor + '20' }]}>
      <Ionicons name={iconName} size={size * 0.5} color={backgroundColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});