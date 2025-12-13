import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_SIZE = SCREEN_WIDTH - SPACING.md * 4;

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
  equity: '#966866',
  mutual_funds: '#3B82F6',
  crypto: '#F59E0B',
  fixed_income: '#10B981',
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
    }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asset Allocation</Text>
      
      {/* Simple bar representation instead of donut */}
      <View style={styles.barsContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.barRow}>
            <View style={styles.labelRow}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.assetLabel}>{item.label}</Text>
            </View>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${item.percentage}%`, backgroundColor: item.color },
                ]}
              />
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
              <Text style={styles.amount}>{formatINR(item.value)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  barsContainer: {
    gap: SPACING.md,
  },
  barRow: {
    gap: SPACING.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  assetLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  amount: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});