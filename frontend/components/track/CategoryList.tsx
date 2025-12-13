import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CategoryIcon } from '../common/CategoryIcon';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINR } from '../../utils/format';

interface Merchant {
  name: string;
  amount: number;
  count: number;
}

interface Category {
  _id: string;
  total: number;
  count: number;
  merchants?: Merchant[];
}

interface CategoryListProps {
  categories: Category[];
  merchants: any[];
}

export function CategoryList({ categories, merchants }: CategoryListProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };
  
  const getCategoryMerchants = (categoryName: string) => {
    return merchants.filter(m => m.category === categoryName).slice(0, 5);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Breakdown</Text>
      <Text style={styles.subtitle}>Tap to see merchants</Text>
      
      <View style={styles.list}>
        {categories.map((category, index) => {
          const isExpanded = expandedCategory === category._id;
          const categoryMerchants = getCategoryMerchants(category._id);
          
          return (
            <View key={index} style={styles.categoryWrapper}>
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => toggleCategory(category._id)}
              >
                <CategoryIcon category={category._id} size={40} />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category._id}</Text>
                  <Text style={styles.categoryCount}>{category.count} transactions</Text>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryAmount}>{formatINR(category.total)}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </View>
              </TouchableOpacity>
              
              {isExpanded && categoryMerchants.length > 0 && (
                <View style={styles.merchantList}>
                  {categoryMerchants.map((merchant: any, mIndex: number) => (
                    <View key={mIndex} style={styles.merchantItem}>
                      <View style={styles.merchantIcon}>
                        <Ionicons name="storefront" size={16} color={COLORS.primary} />
                      </View>
                      <View style={styles.merchantInfo}>
                        <Text style={styles.merchantName}>{merchant._id}</Text>
                        <Text style={styles.merchantCount}>{merchant.count}x</Text>
                      </View>
                      <Text style={styles.merchantAmount}>{formatINR(merchant.total)}</Text>
                    </View>
                  ))}
                </View>
              )}
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
  categoryWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  categoryInfo: {
    flex: 1,
    gap: 2,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  categoryRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  merchantList: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  merchantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  merchantIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantInfo: {
    flex: 1,
    gap: 2,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  merchantCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  merchantAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});