import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Card } from '../common/Card';
import { COLORS, SPACING } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface CategoryData {
  _id: string;
  total: number;
  count: number;
}

interface CategoryDonutChartProps {
  data: CategoryData[];
}

const CHART_COLORS = [
  '#966866', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
];

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  // Take top 3 categories and group rest as "Others"
  const topCategories = data.slice(0, 3);
  const othersTotal = data.slice(3).reduce((sum, item) => sum + item.total, 0);
  
  const chartData = [
    ...topCategories.map((item, index) => ({
      label: item._id,
      value: item.total,
      color: CHART_COLORS[index],
    })),
  ];
  
  if (othersTotal > 0) {
    chartData.push({
      label: 'Others',
      value: othersTotal,
      color: CHART_COLORS[3],
    });
  }
  
  const totalSpend = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate donut segments
  const radius = 60;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedPercentage = 0;
  const segments = chartData.map((item) => {
    const percentage = item.value / totalSpend;
    const dashOffset = circumference * (1 - accumulatedPercentage);
    const dashArray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
    accumulatedPercentage += percentage;
    
    return {
      ...item,
      dashOffset,
      dashArray,
    };
  });
  
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Where's my Money?</Text>
      <Text style={styles.subtitle}>Category Breakdown</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <Svg width={140} height={140}>
            <G rotation="-90" origin="70, 70">
              {segments.map((segment, index) => (
                <Circle
                  key={index}
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={-segment.dashOffset * circumference}
                />
              ))}
            </G>
          </Svg>
          <View style={styles.centerLabel}>
            <Text style={styles.centerAmount}>{formatINR(totalSpend)}</Text>
            <Text style={styles.centerText}>Total</Text>
          </View>
        </View>
        
        <View style={styles.legend}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendCategory}>{item.label}</Text>
                <Text style={styles.legendAmount}>{formatINR(item.value)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {},
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  chartWrapper: {
    width: 140,
    height: 140,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  centerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  legend: {
    flex: 1,
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendCategory: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  legendAmount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});