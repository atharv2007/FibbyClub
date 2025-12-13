import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface RecommendationCardProps {
  type: 'ai' | 'rule';
  title: string;
  description: string;
  assetClass: string;
  reasoning?: string;
}

export function RecommendationCard({
  type,
  title,
  description,
  assetClass,
  reasoning,
}: RecommendationCardProps) {
  const isAI = type === 'ai';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: isAI ? '#8B5CF6' : '#3B82F6' }]}>
          <Ionicons 
            name={isAI ? 'sparkles' : 'bulb'} 
            size={12} 
            color={COLORS.surface} 
          />
          <Text style={styles.badgeText}>{isAI ? 'AI' : 'Rule'}</Text>
        </View>
        <Text style={styles.assetClass}>{assetClass}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {reasoning && (
        <View style={styles.reasoningContainer}>
          <Text style={styles.reasoningLabel}>Why?</Text>
          <Text style={styles.reasoning}>{reasoning}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.surface,
    textTransform: 'uppercase',
  },
  assetClass: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  reasoningContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reasoningLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  reasoning: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});