import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/theme';
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
  const returnPct = ((pnl / (averagePrice * quantity)) * 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="repeat" size={18} color={COLORS.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.fundName} numberOfLines={2}>{fund}</Text>
        </View>
      </View>

      {/* SIP Info */}
      <View style={styles.sipInfo}>
        <View style={styles.sipDetail}>
          <Ionicons name="calendar" size={14} color={COLORS.textSecondary} />
          <Text style={styles.sipText}>Every {sipDate}th</Text>
        </View>
        <View style={styles.sipDetail}>
          <Ionicons name="cash" size={14} color={COLORS.textSecondary} />
          <Text style={styles.sipText}>₹{sipAmount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current Value</Text>
          <Text style={styles.statValue}>{formatINR(currentValue)}</Text>
        </View>
      </View>
      
      <View style={[styles.returnBadge, { backgroundColor: isProfit ? COLORS.success + '15' : COLORS.danger + '15' }]}>
        <Text style={[styles.returnText, { color: isProfit ? COLORS.success : COLORS.danger }]}>
          {isProfit ? '+' : ''}{formatINR(pnl)} ({isProfit ? '+' : ''}{returnPct.toFixed(2)}%)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
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
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  fundName: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    lineHeight: 18,
  },
  sipInfo: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  sipDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sipText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  statsRow: {
    marginBottom: SPACING.sm,
  },
  stat: {},
  statLabel: {
    fontSize: TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontFamily: TYPOGRAPHY.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.data,
  },
  returnBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  returnText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.data,
  },
});