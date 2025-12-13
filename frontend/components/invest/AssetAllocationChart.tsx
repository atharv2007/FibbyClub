import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface AssetAllocation {
  equity: number;
  mutual_funds: number;
  crypto: number;
  fixed_income: number;
  real_estate: number;
  insurance: number;
  nps: number;
}

interface AssetAllocationChartProps {
  allocation: AssetAllocation;
}

const ASSET_COLORS = {
  equity: COLORS.primary,
  mutual_funds: '#3B82F6',
  crypto: '#F59E0B',
  fixed_income: COLORS.success,
  real_estate: '#8B5CF6',
  insurance: '#EC4899',
  nps: '#06B6D4',
};

const ASSET_LABELS = {
  equity: 'Equity',
  mutual_funds: 'Mutual Funds',
  crypto: 'Crypto',
  fixed_income: 'Fixed Income',
  real_estate: 'Real Estate',
  insurance: 'Insurance',
  nps: 'NPS',
};

export function AssetAllocationChart({ allocation }: AssetAllocationChartProps) {
  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  
  const chartData = Object.entries(allocation)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      key,
      value,
      percentage: (value / total) * 100,
      color: ASSET_COLORS[key as keyof AssetAllocation],
      label: ASSET_LABELS[key as keyof AssetAllocation],
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Asset Allocation</Text>
        <Text style={styles.subtitle}>Total: {formatINR(total)}</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {chartData.map((item, index) => (
          <View key={index} style={styles.assetCard}>
            <View style={styles.assetHeader}>
              <View style={styles.labelRow}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.assetLabel}>{item.label}</Text>
              </View>
              <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
            </View>
            
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${item.percentage}%`, backgroundColor: item.color },
                ]}
              />
            </View>
            
            <Text style={styles.amount}>{formatINR(item.value)}</Text>
          </View>
        ))}
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
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  scrollContainer: {
    maxHeight: 320,
    flex: 0,
  },
  scrollContent: {
    gap: SPACING.md,
  },
  assetCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: RADIUS.button,
    padding: SPACING.md,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  assetLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  percentage: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.data,
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  bar: {
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  amount: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.data,
  },
});