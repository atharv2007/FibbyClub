import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINRFull } from '../../utils/format';

interface CategoryLimit {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

interface CategoryLimitsProps {
  categories: CategoryLimit[];
}

export function CategoryLimits({ categories }: CategoryLimitsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category Limits</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <View style={styles.list}>
        {categories.map((category, index) => (
          <CategoryLimitItem key={index} category={category} />
        ))}
      </View>
    </View>
  );
}

function CategoryLimitItem({ category }: { category: CategoryLimit }) {
  const remaining = category.limit - category.spent;
  const percentage = (category.spent / category.limit) * 100;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.remaining}>{formatINRFull(remaining)} left</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressWidth, backgroundColor: category.color },
            ]}
          />
        </View>
      </View>

      {/* Limit Info */}
      <Text style={styles.limitInfo}>
        {formatINRFull(category.spent)} of {formatINRFull(category.limit)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  list: {
    gap: SPACING.md,
  },
  item: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  remaining: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progressContainer: {
    marginVertical: 4,
  },
  progressBackground: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  limitInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
