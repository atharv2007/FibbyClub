import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Recommendation {
  type: 'ai' | 'rule';
  title: string;
  description: string;
  assetClass: string;
  reasoning?: string;
}

interface RecommendationAccordionProps {
  recommendations: Recommendation[];
}

export function RecommendationAccordion({ recommendations }: RecommendationAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={20} color={COLORS.primary} />
          <Text style={styles.title}>Recommendations for You</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{recommendations.length}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {recommendations.map((rec, index) => {
          const isExpanded = expandedIndex === index;
          const isAI = rec.type === 'ai';

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.accordionItem,
                isExpanded && styles.accordionItemExpanded,
              ]}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionHeader}>
                <View style={styles.headerLeft}>
                  <View style={[styles.typeBadge, { backgroundColor: isAI ? '#8B5CF6' : COLORS.primary }]}>
                    <Ionicons 
                      name={isAI ? 'sparkles' : 'bulb'} 
                      size={12} 
                      color={COLORS.surface} 
                    />
                    <Text style={styles.typeBadgeText}>{isAI ? 'AI' : 'RULE'}</Text>
                  </View>
                  <View style={styles.assetBadge}>
                    <Text style={styles.assetText}>{rec.assetClass}</Text>
                  </View>
                </View>
                <Ionicons 
                  name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </View>

              <Text style={styles.accordionTitle}>{rec.title}</Text>
              
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  <Text style={styles.description}>{rec.description}</Text>
                  
                  {rec.reasoning && (
                    <View style={styles.reasoningContainer}>
                      <View style={styles.reasoningHeader}>
                        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                        <Text style={styles.reasoningLabel}>Why this matters</Text>
                      </View>
                      <Text style={styles.reasoning}>{rec.reasoning}</Text>
                    </View>
                  )}

                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Explore Options</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.data,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  scrollContent: {
    gap: SPACING.sm,
  },
  accordionItem: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: RADIUS.button,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accordionItemExpanded: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.heading,
  },
  assetBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  assetText: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.body,
  },
  accordionTitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.md,
  },
  reasoningContainer: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.button,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  reasoningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  reasoningLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  reasoning: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontFamily: TYPOGRAPHY.body,
    fontStyle: 'italic',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary + '10',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.heading,
  },
});