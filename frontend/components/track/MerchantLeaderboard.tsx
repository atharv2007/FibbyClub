import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINRFull } from '../../utils/format';

interface Merchant {
  _id: string;
  total: number;
  count: number;
  category: string;
}

interface MerchantLeaderboardProps {
  merchants: Merchant[];
  onMerchantPress?: (merchantId: string) => void;
}

const MEDAL_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Get merchant initials for avatar fallback
const getInitials = (name: string): string => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Calculate trend (mock data for now - in real app, compare with previous period)
const getTrend = (index: number) => {
  // Mock trend data
  const trends = [
    { direction: 'up', percentage: 15 },
    { direction: 'down', percentage: 5 },
    { direction: 'up', percentage: 8 },
    { direction: 'down', percentage: 12 },
    { direction: 'up', percentage: 3 },
  ];
  return trends[index % trends.length];
};

export function MerchantLeaderboard({ merchants, onMerchantPress }: MerchantLeaderboardProps) {
  const topMerchants = merchants.slice(0, 10);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Top Places You Spend</Text>
          <Text style={styles.subtitle}>Where your money goes</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Merchant List */}
      <View style={styles.list}>
        {topMerchants.map((merchant, index) => {
          const isMedal = index < 3;
          const medalColor = index === 0 ? MEDAL_COLORS.gold : index === 1 ? MEDAL_COLORS.silver : MEDAL_COLORS.bronze;
          const trend = getTrend(index);
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.merchantItem}
              onPress={() => onMerchantPress?.(merchant._id)}
              activeOpacity={0.7}
            >
              {/* Rank Badge */}
              <View style={styles.rankContainer}>
                {isMedal ? (
                  <View style={[styles.medalBadge, { backgroundColor: medalColor + '30' }]}>
                    <Text style={[styles.medalText, { color: medalColor }]}>{index + 1}</Text>
                  </View>
                ) : (
                  <Text style={styles.rankText}>{index + 1}</Text>
                )}
              </View>
              
              {/* Merchant Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(merchant._id)}</Text>
              </View>
              
              {/* Merchant Info */}
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName} numberOfLines={1}>
                  {merchant._id}
                </Text>
                <Text style={styles.transactionCount}>{merchant.count} txns</Text>
              </View>
              
              {/* Amount and Trend */}
              <View style={styles.financials}>
                <Text style={styles.amount}>{formatINRFull(merchant.total)}</Text>
                <View style={styles.trendContainer}>
                  <Ionicons
                    name={trend.direction === 'up' ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={trend.direction === 'up' ? COLORS.danger : COLORS.success}
                  />
                  <Text
                    style={[
                      styles.trendText,
                      { color: trend.direction === 'up' ? COLORS.danger : COLORS.success }
                    ]}
                  >
                    {trend.percentage}%
                  </Text>
                </View>
              </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E24',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  list: {
    gap: 1,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  merchantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  merchantInfo: {
    flex: 1,
    gap: 4,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  transactionCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  financials: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: -0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});