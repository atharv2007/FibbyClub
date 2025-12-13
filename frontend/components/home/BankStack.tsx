import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { formatINRFull } from '../../utils/format';

interface BankAccount {
  _id: string;
  bank_name: string;
  account_number: string;
  balance: number;
  last_updated: string;
}

interface BankStackProps {
  account: BankAccount;
}

export const BankStack: React.FC<BankStackProps> = ({ account }) => {
  const lastUpdated = new Date(account.last_updated).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <View style={styles.container}>
      {/* Shadow card behind */}
      <View style={styles.shadowCard}>
        <View style={styles.shadowCardInner}>
          <Ionicons name="add-circle" size={24} color={COLORS.textSecondary} />
          <Text style={styles.shadowCardText}>Link another account</Text>
        </View>
      </View>
      
      {/* Main card */}
      <Card style={styles.mainCard} shadow="md">
        <View style={styles.header}>
          <View style={styles.bankInfo}>
            <View style={styles.bankLogo}>
              <Text style={styles.bankLogoText}>{account.bank_name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.bankName}>{account.bank_name}</Text>
              <Text style={styles.accountNumber}>{account.account_number}</Text>
            </View>
          </View>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textSecondary} />
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balance}>{formatINRFull(account.balance)}</Text>
          <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    height: 180,
    position: 'relative',
  },
  shadowCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 168,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    transform: [{ scale: 0.95 }],
  },
  shadowCardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  shadowCardText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  mainCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 168,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  accountNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  balanceContainer: {
    gap: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: -1,
  },
  lastUpdated: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
});