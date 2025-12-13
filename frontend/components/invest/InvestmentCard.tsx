import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
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
  fd: '#10B981',
  bond: '#3B82F6',
  real_estate: '#8B5CF6',
  nps: '#06B6D4',
  ppf: '#10B981',
  insurance: '#EC4899',
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={iconName as any} size={18} color={color} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {metadata?.platform && (
            <Text style={styles.platform}>{metadata.platform}</Text>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>{formatINR(amountInvested)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{formatINR(currentValue)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Returns</Text>
          <Text style={[styles.statValue, { color: isProfit ? '#10B981' : '#F43F5E' }]}>
            {returnsPct.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  platform: {
    fontSize: 10,
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
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'Rethink Sans',
  },
});