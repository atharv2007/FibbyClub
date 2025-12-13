import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface Merchant {
  _id: string;
  total: number;
  count: number;
  category: string;
}

interface MerchantLeaderboardProps {
  merchants: Merchant[];
}

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export function MerchantLeaderboard({ merchants }: MerchantLeaderboardProps) {
  const topMerchants = merchants.slice(0, 10);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Spending Places</Text>
      <Text style={styles.subtitle}>Where your money goes</Text>
      
      <View style={styles.list}>
        {topMerchants.map((merchant, index) => {
          const isMedal = index < 3;
          
          return (
            <View key={index} style={styles.merchantItem}>
              <View style={styles.rank}>
                {isMedal ? (
                  <View style={[styles.medalBadge, { backgroundColor: MEDAL_COLORS[index] + '30' }]}>
                    <Text style={styles.medalText}>{index + 1}</Text>
                  </View>
                ) : (
                  <Text style={styles.rankText}>{index + 1}</Text>
                )}
              </View>
              
              <View style={styles.merchantIcon}>
                <Ionicons name="storefront" size={20} color={COLORS.primary} />
              </View>
              
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{merchant._id}</Text>
                <View style={styles.merchantMeta}>
                  <Text style={styles.merchantCategory}>{merchant.category}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.merchantCount}>{merchant.count} visits</Text>
                </View>
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.amount}>{formatINR(merchant.total)}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progress,
                      { width: `${Math.min((merchant.total / topMerchants[0].total) * 100, 100)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
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
  list: {
    gap: SPACING.sm,
  },
  merchantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  rank: {
    width: 32,
    alignItems: 'center',
  },
  medalBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  merchantIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantInfo: {
    flex: 1,
    gap: 4,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  merchantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  merchantCategory: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dot: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  merchantCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 80,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressBar: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});