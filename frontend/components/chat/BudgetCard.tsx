import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  emoji: string;
  color: string;
}

interface BudgetCardProps {
  spent: number;
  budget: number;
  categories: CategoryBreakdown[];
}

export default function BudgetCard({ spent, budget, categories }: BudgetCardProps) {
  const percentageUsed = (spent / budget) * 100;
  
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Overview</Text>
        <Text style={styles.subtitle}>This Month</Text>
      </View>
      
      {/* Budget Status */}
      <View style={styles.budgetSection}>
        <View style={styles.budgetRow}>
          <Text style={styles.label}>Spent</Text>
          <Text style={styles.amountLarge}>₹{spent.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.budgetRow}>
          <Text style={styles.label}>Budget</Text>
          <Text style={styles.amountSecondary}>₹{budget.toLocaleString('en-IN')}</Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          {categories.map((cat, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.percentageText}>{percentageUsed.toFixed(0)}% used</Text>
      </View>
      
      {/* Category Breakdown */}
      <View style={styles.categoriesContainer}>
        {categories.map((cat, index) => (
          <View key={index} style={styles.categoryRow}>
            <View style={styles.categoryLeft}>
              <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryName}>{cat.category}</Text>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryAmount}>₹{cat.amount.toLocaleString('en-IN')}</Text>
              <Text style={styles.categoryPercentage}>{cat.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs / 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  budgetSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  budgetRow: {
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.xs / 2,
  },
  amountLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  amountSecondary: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressSegment: {
    height: '100%',
  },
  percentageText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    textAlign: 'right',
  },
  categoriesContainer: {
    gap: SPACING.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    fontWeight: '500',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  categoryPercentage: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
});
