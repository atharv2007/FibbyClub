import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface MonthlyData {
  month: string;
  amount: number;
  year?: number;
  month_num?: number;
  day?: number;
  date?: string;
  week_num?: number;
  week_start?: string;
  week_end?: string;
  period_start?: string;
  period_end?: string;
  start_month?: number;
  start_year?: number;
}

interface MonthlyBarChartProps {
  data: MonthlyData[];
  onMonthSelect: (item: MonthlyData) => void;
  onPeriodChange: (period: string) => void;
  selectedPeriod?: string;
}

type TimePeriod = '1wk' | '1mnth' | '6mnth' | '1yr';

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '1wk', label: '1 wk' },
  { value: '1mnth', label: '1 mnth' },
  { value: '6mnth', label: '6 mnth' },
  { value: '1yr', label: '1 yr' },
];

export function MonthlyBarChart({ data, onMonthSelect, onPeriodChange, selectedPeriod = '6mnth' }: MonthlyBarChartProps) {
  const [selectedMonth, setSelectedMonth] = useState(data[data.length - 1]?.month);
  const [activePeriod, setActivePeriod] = useState<TimePeriod>(selectedPeriod as TimePeriod);
  
  // Display all data (no slicing)
  const displayData = data;
  const maxAmount = Math.max(...displayData.map(d => d.amount));
  
  const handleBarPress = (item: MonthlyData) => {
    setSelectedMonth(item.month);
    onMonthSelect(item);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setActivePeriod(period);
    onPeriodChange(period);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Spending Matrix</Text>
          <Text style={styles.subtitle}>Tap on a bar to filter below</Text>
        </View>
      </View>

      {/* Time Period Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.periodSelector}
        contentContainerStyle={styles.periodSelectorContent}
      >
        {TIME_PERIODS.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodChip,
              activePeriod === period.value && styles.periodChipActive,
            ]}
            onPress={() => handlePeriodChange(period.value)}
          >
            <Text
              style={[
                styles.periodChipText,
                activePeriod === period.value && styles.periodChipTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Bar Chart with Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScrollContent}
      >
        <View style={styles.chartContainer}>
          {displayData.map((item, index) => {
            const heightPercentage = (item.amount / maxAmount) * 100;
            const isSelected = item.month === selectedMonth;
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.barWrapper}
                onPress={() => handleBarPress(item)}
              >
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${heightPercentage}%`,
                        backgroundColor: isSelected ? COLORS.primary : COLORS.primary + '60',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.monthLabel, isSelected && styles.selectedLabel]}>
                  {item.month}
                </Text>
                <Text style={styles.amountLabel}>{formatINR(item.amount)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
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
  },
  periodSelector: {
    marginBottom: SPACING.md,
  },
  periodSelectorContent: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    gap: 10,
  },
  periodChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  periodChipTextActive: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  chartScrollContent: {
    paddingHorizontal: SPACING.md,
    paddingRight: SPACING.xxl,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: SPACING.md,
    gap: SPACING.md,
    minWidth: '100%',
  },
  barWrapper: {
    width: 60,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  barContainer: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: RADIUS.sm,
    borderTopRightRadius: RADIUS.sm,
  },
  monthLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  selectedLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  amountLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
});