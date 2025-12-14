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
      high: { bg: '#FEE2E2', text: '#DC2626', label: 'High Priority' },
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
        <Ionicons name="sparkles" size={20} color={COLORS.primary} />
        <Text style={styles.title}>AI Recommendations</Text>
        <View style={styles.aibadge}>
          <Text style={styles.aiBadgeText}>Powered by AI</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Smart insights to improve your credit health and maximize rewards
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
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: rec.color + '20' }]}>
                <Ionicons name={rec.icon as any} size={24} color={rec.color} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{rec.title}</Text>
                <View style={styles.cardMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: priorityBadge.bg }]}>
                    <Text style={[styles.priorityText, { color: priorityBadge.text }]}>
                      {priorityBadge.label}
                    </Text>
                  </View>
                  <Text style={styles.category}>{rec.category}</Text>
                </View>
              </View>
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={COLORS.textSecondary} 
              />
            </View>

            {/* Expandable Description */}
            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.description}>{rec.description}</Text>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: rec.color }]}>
                  <Text style={styles.actionButtonText}>{rec.action}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
    paddingVertical: SPACING.sm,
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
    flex: 1,
  },
  aiBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  recommendationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendationCardExpanded: {
    borderColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  expandedContent: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});