import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface CreditScoreGaugeProps {
  score: number;
  scoreRange: string;
}

export function CreditScoreGauge({ score, scoreRange }: CreditScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 750) return '#10B981';
    if (score >= 650) return '#F59E0B';
    return '#EF4444';
  };

  const color = getScoreColor(score);
  const percentage = (score / 900) * 100;
  const strokeDasharray = `${percentage * 2.83} 283`;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Credit Score</Text>
          <Text style={styles.lastUpdated}>Updated today</Text>
        </View>
        
        <View style={styles.gaugeContainer}>
          <Svg width="200" height="120" viewBox="0 0 200 120">
            <Path
              d="M 30 100 A 70 70 0 0 1 170 100"
              fill="none"
              stroke={COLORS.border}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <Path
              d="M 30 100 A 70 70 0 0 1 170 100"
              fill="none"
              stroke={color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
            />
          </Svg>
          
          <View style={styles.scoreContainer}>
            <Text style={[styles.score, { color }]}>{score}</Text>
            <Text style={styles.scoreRange}>{scoreRange}</Text>
          </View>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Poor</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Good</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Excellent</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreRange: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});