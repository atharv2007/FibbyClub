import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface Transaction {
  user_id: string;
  card_id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  reward_points: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onFilterChange: (cardId?: string, category?: string) => void;
}

const CATEGORIES = [
  { label: 'All', value: undefined, icon: 'apps' },
  { label: 'Food', value: 'Food & Dining', icon: 'restaurant' },
  { label: 'Shopping', value: 'Shopping', icon: 'cart' },
  { label: 'Travel', value: 'Travel', icon: 'airplane' },
  { label: 'Groceries', value: 'Groceries', icon: 'basket' },
  { label: 'Bills', value: 'Utilities', icon: 'receipt' },
];

export function TransactionHistory({ transactions, onFilterChange }: TransactionHistoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const handleCategoryFilter = (category: string | undefined) => {
    setSelectedCategory(category);
    onFilterChange(undefined, category);
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat?.icon || 'receipt';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': '#EF4444',
      'Shopping': '#8B5CF6',
      'Entertainment': '#EC4899',
      'Travel': '#3B82F6',
      'Groceries': '#10B981',
      'Utilities': '#F59E0B',
      'Fuel': '#6B7280',
    };
    return colors[category] || COLORS.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const groupedTransactions: { [key: string]: Transaction[] } = {};
  transactions.forEach(transaction => {
    const dateKey = formatDate(transaction.date);
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(transaction);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.count}>{transactions.length}</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {CATEGORIES.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterChip,
              selectedCategory === category.value && styles.filterChipActive
            ]}
            onPress={() => handleCategoryFilter(category.value)}
          >
            <Ionicons 
              name={category.icon as any} 
              size={14} 
              color={selectedCategory === category.value ? '#FFFFFF' : COLORS.textSecondary} 
            />
            <Text style={[
              styles.filterText,
              selectedCategory === category.value && styles.filterTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.transactionsList}>
        {Object.keys(groupedTransactions).length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.border} />
            <Text style={styles.emptyText}>No transactions</Text>
          </View>
        ) : (
          Object.keys(groupedTransactions).map((dateKey) => (
            <View key={dateKey} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{dateKey}</Text>
              {groupedTransactions[dateKey].map((transaction, index) => {
                const categoryColor = getCategoryColor(transaction.category);
                return (
                  <View key={index} style={styles.transactionCard}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '15' }]}>
                      <Ionicons 
                        name={getCategoryIcon(transaction.category) as any} 
                        size={18} 
                        color={categoryColor} 
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.merchant}>{transaction.merchant}</Text>
                      <Text style={styles.category}>{transaction.category}</Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text style={styles.amount}>-₹{transaction.amount.toFixed(0)}</Text>
                      {transaction.reward_points > 0 && (
                        <View style={styles.rewardBadge}>
                          <Ionicons name="gift" size={10} color={COLORS.primary} />
                          <Text style={styles.rewardText}>+{transaction.reward_points}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  filterContainer: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    paddingRight: SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  transactionsList: {
    gap: SPACING.md,
  },
  dateGroup: {
    marginBottom: SPACING.sm,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  merchant: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});
