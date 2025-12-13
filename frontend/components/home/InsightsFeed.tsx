import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface Insight {
  _id: string;
  type: 'alert' | 'habit' | 'tip' | 'achievement';
  message: string;
  category?: string;
  is_read: boolean;
}

interface InsightsFeedProps {
  insights: Insight[];
}

const INSIGHT_CONFIG = {
  alert: {
    icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
    color: COLORS.danger,
    bgColor: COLORS.danger + '15',
  },
  habit: {
    icon: 'refresh-circle' as keyof typeof Ionicons.glyphMap,
    color: COLORS.warning,
    bgColor: COLORS.warning + '15',
  },
  tip: {
    icon: 'bulb' as keyof typeof Ionicons.glyphMap,
    color: COLORS.info,
    bgColor: COLORS.info + '15',
  },
  achievement: {
    icon: 'trophy' as keyof typeof Ionicons.glyphMap,
    color: COLORS.success,
    bgColor: COLORS.success + '15',
  },
};

export const InsightsFeed: React.FC<InsightsFeedProps> = ({ insights }) => {
  if (insights.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insights for you</Text>
      <Text style={styles.subtitle}>Your money buddy's thoughts</Text>
      
      <View style={styles.feed}>
        {insights.slice(0, 4).map((insight) => {
          const config = INSIGHT_CONFIG[insight.type];
          
          return (
            <Card key={insight._id} style={styles.insightCard}>
              <View style={styles.insightContent}>
                <View style={[styles.iconCircle, { backgroundColor: config.bgColor }]}>
                  <Ionicons name={config.icon} size={20} color={config.color} />
                </View>
                <View style={styles.textContent}>
                  <View style={styles.typeRow}>
                    <Text style={[styles.type, { color: config.color }]}>
                      {insight.type.toUpperCase()}
                    </Text>
                    {!insight.is_read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.message}>{insight.message}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  feed: {
    gap: SPACING.sm,
  },
  insightCard: {
    padding: SPACING.md,
  },
  insightContent: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  type: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});