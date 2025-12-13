import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface AgentChip {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  action: () => void;
}

interface AgentChipsProps {
  onChipPress?: (chipId: string) => void;
}

const AGENT_CHIPS: AgentChip[] = [
  { id: 'scan', icon: 'camera', label: 'Scan Bill', action: () => {} },
  { id: 'split', icon: 'people', label: 'Split Expense', action: () => {} },
  { id: 'forecast', icon: 'trending-up', label: 'Forecast Balance', action: () => {} },
  { id: 'audit', icon: 'search', label: 'Sub Audit', action: () => {} },
  { id: 'budget', icon: 'pie-chart', label: 'Budget', action: () => {} },
];

export function AgentChips({ onChipPress }: AgentChipsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {AGENT_CHIPS.map((chip) => (
          <TouchableOpacity 
            key={chip.id} 
            style={styles.chip}
            onPress={() => onChipPress?.(chip.id)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={chip.icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.label}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
});