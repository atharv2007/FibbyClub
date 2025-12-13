import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface InvestmentCardProps {
  type: string;
  name: string;
  amountInvested: number;
  currentValue: number;
  returns: number;
  returnsPct: number;
  metadata?: any;
}

const TYPE_ICONS: Record<string, string> = {
  crypto: 'logo-bitcoin',
  fd: 'card',
  bond: 'document-text',
  real_estate: 'home',
  nps: 'shield-checkmark',
  ppf: 'wallet',
  insurance: 'umbrella',
};

const TYPE_COLORS: Record<string, string> = {
  crypto: '#F59E0B',
  fd: COLORS.success,
  bond: '#3B82F6',
  real_estate: '#8B5CF6',
  nps: '#06B6D4',
  ppf: COLORS.success,
  insurance: '#EC4899',
};

const TYPE_LABELS: Record<string, string> = {
  crypto: 'Crypto',
  fd: 'Fixed Deposit',
  bond: 'Bonds',
  real_estate: 'Real Estate',
  nps: 'NPS',
  ppf: 'PPF',
  insurance: 'Insurance',
};

export function InvestmentCard({
  type,
  name,
  amountInvested,
  currentValue,
  returns,
  returnsPct,
  metadata,
}: InvestmentCardProps) {
  const isProfit = returns >= 0;
  const iconName = TYPE_ICONS[type] || 'cash';
  const color = TYPE_COLORS[type] || COLORS.primary;
  const typeLabel = TYPE_LABELS[type] || type;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={iconName as any} size={20} color={color} />
        </View>
        <View style={styles.typeBadge}>
          <Text style={[styles.typeText, { color }]}>{typeLabel}</Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={2}>{name}</Text>
      
      {metadata?.platform && (
        <Text style={styles.platform}>via {metadata.platform}</Text>
      )}

      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>{formatINR(amountInvested)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{formatINR(currentValue)}</Text>
        </View>
      </View>

      <View style={[styles.returnBadge, { backgroundColor: isProfit ? COLORS.success + '15' : COLORS.danger + '15' }]}>
        <Text style={[styles.returnText, { color: isProfit ? COLORS.success : COLORS.danger }]}>
          {isProfit ? '+' : ''}{returnsPct.toFixed(2)}% returns
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
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
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceVariant,
  },
  typeText: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
  name: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  platform: {
    fontSize: TYPOGRAPHY.tiny,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
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
    fontSize: TYPOGRAPHY.caption,
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