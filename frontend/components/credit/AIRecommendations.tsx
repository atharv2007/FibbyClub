import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface Recommendation {
  title: string;
  category: string;
  priority: string;
  description: string;
  action: string;
  icon: string;
  color: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      high: { bg: '#FEE2E2', text: '#DC2626', label: 'High' },
      medium: { bg: '#FEF3C7', text: '#D97706', label: 'Medium' },
      low: { bg: '#DBEAFE', text: '#2563EB', label: 'Low' },
    };
    return badges[priority] || badges.medium;
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={10} color={COLORS.primary} />
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Personalized tips to improve your credit health
      </Text>

      {recommendations.map((rec, index) => {
        const isExpanded = expandedIndex === index;
        const priorityBadge = getPriorityBadge(rec.priority);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.recommendationCard,
              isExpanded && styles.recommendationCardExpanded
            ]}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: rec.color + '15' }]}>
                <Ionicons name={rec.icon as any} size={20} color={rec.color} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{rec.title}</Text>
                <View style={styles.cardMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: priorityBadge.bg }]}>
                    <Text style={[styles.priorityText, { color: priorityBadge.text }]}>
                      {priorityBadge.label}
                    </Text>
                  </View>
                  <Text style={styles.category}>• {rec.category}</Text>
                </View>
              </View>
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={18} 
                color={COLORS.textSecondary} 
              />
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.description}>{rec.description}</Text>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: rec.color }]}>
                  <Text style={styles.actionButtonText}>{rec.action}</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  recommendationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendationCardExpanded: {
    borderColor: COLORS.primary + '40',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  expandedContent: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
