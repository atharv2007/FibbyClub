import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface SIPCardProps {
  fund: string;
  sipAmount: number;
  sipDate: number;
  quantity: number;
  averagePrice: number;
  lastPrice: number;
  pnl: number;
}

export function SIPCard({
  fund,
  sipAmount,
  sipDate,
  quantity,
  averagePrice,
  lastPrice,
  pnl,
}: SIPCardProps) {
  const isProfit = pnl >= 0;
  const currentValue = lastPrice * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="repeat" size={16} color={COLORS.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.fundName} numberOfLines={2}>{fund}</Text>
          <Text style={styles.sipInfo}>₹{sipAmount.toLocaleString()}/month • {sipDate}th</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current Value</Text>
          <Text style={styles.statValue}>{formatINR(currentValue)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Returns</Text>
          <Text style={[styles.statValue, { color: isProfit ? '#10B981' : '#F43F5E' }]}>
            {isProfit ? '+' : ''}{formatINR(pnl)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
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
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  fundName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  sipInfo: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {},
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'Rethink Sans',
  },
});