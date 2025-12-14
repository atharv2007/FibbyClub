import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';

interface BankData {
  bank_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  ifsc: string;
}

export default function SelectBanksScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams();
  
  const [banks, setBanks] = useState<BankData[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse banks from params
    if (params.banks) {
      const banksList = JSON.parse(params.banks as string);
      setBanks(banksList);
      // Select all banks by default
      const allIndices = new Set(banksList.map((_: any, idx: number) => idx));
      setSelectedBanks(allIndices);
    }
  }, [params.banks]);

  const toggleBank = (index: number) => {
    const newSelected = new Set(selectedBanks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedBanks(newSelected);
  };

  const handleConfirm = async () => {
    if (selectedBanks.size === 0) {
      Alert.alert('Error', 'Please select at least one bank account');
      return;
    }

    setLoading(true);
    try {
      const selected_banks = banks.filter((_, idx) => selectedBanks.has(idx));
      
      const response = await api.signup({
        name: params.name as string,
        email: params.email as string,
        phone: params.phone as string,
        pan_card: params.pan_card as string,
        selected_banks,
      });

      if (response.status === 'success' && response.user) {
        await login(response.user);
        Alert.alert(
          'Success!',
          'Your account has been created successfully',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
      } else {
        Alert.alert('Error', response.detail || 'Signup failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Bank Accounts</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.instruction}>
          We found {banks.length} bank account(s) linked to your PAN card.
          {'\n'}Select the accounts you want to link with Fibby.
        </Text>

        {banks.map((bank, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleBank(index)}
            activeOpacity={0.7}
          >
            <Card style={styles.bankCard}>
              <View style={styles.bankHeader}>
                <View style={styles.bankInfo}>
                  <View style={styles.bankLogo}>
                    <Text style={styles.bankLogoText}>
                      {bank.bank_name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.bankDetails}>
                    <Text style={styles.bankName}>{bank.bank_name}</Text>
                    <Text style={styles.accountNumber}>
                      {bank.account_number} • {bank.account_type}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => toggleBank(index)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={selectedBanks.has(index) ? 'checkbox' : 'square-outline'}
                    size={28}
                    color={selectedBanks.has(index) ? COLORS.primary : COLORS.border}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Balance</Text>
                <Text style={styles.balance}>₹{bank.balance.toLocaleString('en-IN')}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.selectedText}>
          {selectedBanks.size} of {banks.length} account(s) selected
        </Text>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.disabledButton]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm & Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  instruction: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  bankCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  bankLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  balanceContainer: {
    marginTop: SPACING.xs,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  selectedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 4,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
