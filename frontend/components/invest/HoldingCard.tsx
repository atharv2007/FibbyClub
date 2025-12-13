import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface HoldingCardProps {
  tradingsymbol: string;
  quantity: number;
  averagePrice: number;
  lastPrice: number;
  pnl: number;
  dayChange: number;
  dayChangePct: number;
  onPress?: () => void;
}

export function HoldingCard({
  tradingsymbol,
  quantity,
  averagePrice,
  lastPrice,
  pnl,
  dayChange,
  dayChangePct,
  onPress,
}: HoldingCardProps) {
  const isProfitTotal = pnl >= 0;
  const isProfitDay = dayChange >= 0;
  const currentValue = lastPrice * quantity;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.symbol}>{tradingsymbol}</Text>
          <Text style={styles.quantity}>{quantity} shares</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{formatINR(lastPrice)}</Text>
          <View style={[styles.changeBadge, { backgroundColor: isProfitDay ? COLORS.success + '20' : COLORS.danger + '20' }]}>
            <Text style={[styles.dayChange, { color: isProfitDay ? COLORS.success : COLORS.danger }]}>
              {isProfitDay ? '▲' : '▼'} {Math.abs(dayChangePct).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{formatINR(currentValue)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>P&L</Text>
          <Text style={[styles.statValue, { color: isProfitTotal ? COLORS.success : COLORS.danger }]}>
            {isProfitTotal ? '+' : ''}{formatINR(pnl)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  symbol: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs,
  },
  quantity: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.data,
    marginBottom: SPACING.xs,
  },
  changeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  dayChange: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.data,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontFamily: TYPOGRAPHY.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.data,
  },
});