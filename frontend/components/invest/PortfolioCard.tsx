import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
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
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
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
            <Ionicons name="link" size={16} color={COLORS.primary} />
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
              <Text style={[styles.statValue, { color: COLORS.surface }]}>
                {formatINR(Math.abs(totalPnl))}
              </Text>
              <View style={[styles.badge, { backgroundColor: isProfit ? COLORS.success : COLORS.danger }]}>
                <Text style={styles.badgeText}>
                  {isProfit ? '+' : '-'}{Math.abs(totalReturnsPct).toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  container: {
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    fontFamily: TYPOGRAPHY.heading,
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.data,
    letterSpacing: -0.5,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.button,
  },
  connectText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.heading,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.button,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  stat: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: SPACING.md,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.tiny,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.xs,
    fontFamily: TYPOGRAPHY.body,
  },
  statValue: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.data,
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '700',
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.data,
  },
});