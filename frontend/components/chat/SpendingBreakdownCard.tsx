import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface Category {
  name: string;
  emoji: string;
  amount: number;
  percentage: number;
  color: string;
}

interface SpendingBreakdownCardProps {
  total: number;
  period: string;
  categories: Category[];
}

export default function SpendingBreakdownCard({ total, period, categories }: SpendingBreakdownCardProps) {
  // Prepare data for horizontal stacked bar
  const barData = categories.map((cat) => ({
    value: cat.percentage,
    frontColor: cat.color,
    label: '',
  }));

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SPENDING BREAKDOWN</Text>
        <View style={styles.periodBadge}>
          <Text style={styles.periodText}>{period}</Text>
        </View>
      </View>

      {/* Total Amount */}
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</Text>
      </View>

      {/* Horizontal Stacked Bar */}
      <View style={styles.chartContainer}>
        <View style={styles.stackedBar}>
          {categories.map((cat, index) => (
            <View
              key={index}
              style={[
                styles.barSegment,
                {
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Category List */}
      <View style={styles.categoriesContainer}>
        {categories.map((cat, index) => (
          <View key={index} style={styles.categoryRow}>
            <View style={styles.categoryLeft}>
              <View style={[styles.colorIndicator, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryPercentage}>{cat.percentage}%</Text>
              </View>
            </View>
            <Text style={styles.categoryAmount}>₹{cat.amount.toLocaleString('en-IN')}</Text>
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
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    letterSpacing: 0.5,
  },
  periodBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.button,
  },
  periodText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.body,
  },
  totalSection: {
    marginBottom: SPACING.lg,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.xs / 2,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  chartContainer: {
    marginBottom: SPACING.lg,
  },
  stackedBar: {
    height: 24,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  barSegment: {
    height: '100%',
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
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  categoryAmount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
});
