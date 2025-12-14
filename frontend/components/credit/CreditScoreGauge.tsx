import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLORS, SPACING } from '../../constants/theme';

interface CreditScoreGaugeProps {
  score: number;
  scoreRange: string;
}

export function CreditScoreGauge({ score, scoreRange }: CreditScoreGaugeProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 750) return '#10B981'; // Excellent - Emerald Green
    if (score >= 650) return '#F59E0B'; // Good/Fair - Amber
    return '#EF4444'; // Needs Work - Rose Red
  };

  const color = getScoreColor(score);
  
  // Calculate percentage for the arc (score out of 900)
  const percentage = (score / 900) * 100;
  const strokeDasharray = `${percentage * 2.83} 283`; // 283 is circumference of semi-circle

  return (
    <View style={styles.container}>
      <View style={styles.gaugeContainer}>
        <Svg width="200" height="120" viewBox="0 0 200 120">
          {/* Background arc */}
          <Path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke={COLORS.border}
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <Path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
          />
        </Svg>
        
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          <Text style={styles.scoreRange}>{scoreRange}</Text>
        </View>
      </View>

      {/* Score ranges */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>&lt;650 Needs Work</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>650-749 Good</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>750+ Excellent</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreRange: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
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
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
