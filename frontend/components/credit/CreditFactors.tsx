import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface Factor {
  name: string;
  impact: string;
  value: number;
  status: string;
  description: string;
  tip: string;
}

interface CreditFactorsProps {
  factors: Factor[];
}

export function CreditFactors({ factors }: CreditFactorsProps) {
  const getImpactColor = (impact: string) => {
    if (impact === 'High') return '#EF4444';
    if (impact === 'Medium') return '#F59E0B';
    return '#6B7280';
  };

  const getStatusColor = (status: string) => {
    if (status === 'excellent') return '#10B981';
    if (status === 'good') return '#3B82F6';
    if (status === 'fair') return '#F59E0B';
    return '#EF4444';
  };

  const getFactorIcon = (name: string) => {
    if (name.includes('Payment')) return 'calendar-outline';
    if (name.includes('Utilization')) return 'pie-chart-outline';
    if (name.includes('Age')) return 'time-outline';
    if (name.includes('Mix')) return 'layers-outline';
    if (name.includes('Inquiries')) return 'search-outline';
    return 'stats-chart-outline';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="game-controller" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Credit Factors</Text>
        <Text style={styles.subtitle}>Your RPG Stats</Text>
      </View>

      {factors.map((factor, index) => (
        <View key={index} style={styles.factorCard}>
          <View style={styles.factorHeader}>
            <View style={styles.factorTitleRow}>
              <View style={[styles.iconContainer, { backgroundColor: getStatusColor(factor.status) + '20' }]}>
                <Ionicons name={getFactorIcon(factor.name) as any} size={20} color={getStatusColor(factor.status)} />
              </View>
              <View style={styles.factorInfo}>
                <Text style={styles.factorName}>{factor.name}</Text>
                <View style={styles.impactBadge}>
                  <View style={[styles.impactDot, { backgroundColor: getImpactColor(factor.impact) }]} />
                  <Text style={[styles.impactText, { color: getImpactColor(factor.impact) }]}>
                    {factor.impact} Impact
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.factorValue, { color: getStatusColor(factor.status) }]}>
              {factor.value}%
            </Text>
          </View>

          {/* Progress bar - RPG style */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${factor.value}%`,
                    backgroundColor: getStatusColor(factor.status)
                  }
                ]} 
              />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{factor.description}</Text>
          
          {/* Tip */}
          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={14} color={COLORS.primary} />
            <Text style={styles.tip}>{factor.tip}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginLeft: 'auto',
  },
  factorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  factorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  factorInfo: {
    flex: 1,
  },
  factorName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  impactDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '500',
  },
  factorValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginBottom: SPACING.sm,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  tip: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    lineHeight: 16,
  },
});