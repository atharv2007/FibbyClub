import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface PortfolioCardProps {
  totalValue: number;
  totalInvested: number;
  totalPnl: number;
  totalReturnsPct: number;
  onConnectBroker: () => void;
}

export function PortfolioCard({
  totalValue,
  totalInvested,
  totalPnl,
  totalReturnsPct,
  onConnectBroker,
}: PortfolioCardProps) {
  const isProfit = totalPnl >= 0;

  return (
    <LinearGradient
      colors={['#966866', '#7a5553']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>PORTFOLIO VALUE</Text>
          <Text style={styles.value}>{formatINR(totalValue)}</Text>
        </View>
        <TouchableOpacity style={styles.connectButton} onPress={onConnectBroker}>
          <Ionicons name="link" size={16} color={COLORS.surface} />
          <Text style={styles.connectText}>Connect Broker</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>{formatINR(totalInvested)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Total Returns</Text>
          <View style={styles.returnRow}>
            <Text style={[styles.statValue, { color: isProfit ? '#10B981' : '#F43F5E' }]}>
              {formatINR(Math.abs(totalPnl))}
            </Text>
            <Text style={[styles.returnPct, { color: isProfit ? '#10B981' : '#F43F5E' }]}>
              {isProfit ? '+' : '-'}{Math.abs(totalReturnsPct).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: 'Rethink Sans',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  connectText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  stat: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SPACING.md,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: 'Rethink Sans',
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  returnPct: {
    fontSize: 12,
    fontWeight: '600',
  },
});