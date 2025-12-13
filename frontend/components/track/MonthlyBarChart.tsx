import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface MonthlyData {
  month: string;
  amount: number;
}

interface MonthlyBarChartProps {
  data: MonthlyData[];
  onMonthSelect: (month: string) => void;
}

export function MonthlyBarChart({ data, onMonthSelect }: MonthlyBarChartProps) {
  const [selectedMonth, setSelectedMonth] = useState(data[data.length - 1]?.month);
  
  const maxAmount = Math.max(...data.map(d => d.amount));
  
  const handleBarPress = (month: string) => {
    setSelectedMonth(month);
    onMonthSelect(month);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending</Text>
      <Text style={styles.subtitle}>Last 6 months</Text>
      
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const heightPercentage = (item.amount / maxAmount) * 100;
          const isSelected = item.month === selectedMonth;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.barWrapper}
              onPress={() => handleBarPress(item.month)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
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
    marginBottom: SPACING.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: SPACING.md,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  barContainer: {
    width: '80%',
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