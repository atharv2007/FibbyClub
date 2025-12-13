import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
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
      <View style={styles.header}>
        <View>
          <Text style={styles.symbol}>{tradingsymbol}</Text>
          <Text style={styles.quantity}>Qty: {quantity}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{formatINR(lastPrice)}</Text>
          <View style={styles.changeRow}>
            <Text style={[styles.dayChange, { color: isProfitDay ? '#10B981' : '#F43F5E' }]}>
              {isProfitDay ? '+' : ''}{dayChangePct.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>{formatINR(averagePrice * quantity)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{formatINR(currentValue)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>P&L</Text>
          <Text style={[styles.statValue, { color: isProfitTotal ? '#10B981' : '#F43F5E' }]}>
            {isProfitTotal ? '+' : ''}{formatINR(pnl)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  quantity: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'Rethink Sans',
  },
  changeRow: {
    marginTop: 2,
  },
  dayChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'Rethink Sans',
  },
});