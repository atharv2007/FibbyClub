import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';

interface AddBankModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (bankData: any) => void;
}

// Mock bank accounts that will be "discovered" via PAN
const MOCK_BANKS = [
  { 
    bank_name: 'ICICI Bank',
    account_number: 'XXXX8901',
    balance: 45230.50
  },
  { 
    bank_name: 'State Bank of India',
    account_number: 'XXXX2345',
    balance: 28750.00
  },
  { 
    bank_name: 'Axis Bank',
    account_number: 'XXXX6789',
    balance: 67890.25
  },
];

export function AddBankModal({ visible, onClose, onAdd }: AddBankModalProps) {
  const [panNumber, setPanNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPAN = async () => {
    // Validate PAN format (basic validation)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      Alert.alert('Invalid PAN', 'Please enter a valid PAN card number (e.g., ABCDE1234F)');
      return;
    }

    setIsVerifying(true);
    
    // Simulate AA service verification (2 second delay)
    setTimeout(() => {
      // Add mock bank accounts
      MOCK_BANKS.forEach((bank) => {
        const bankData = {
          ...bank,
          last_updated: new Date().toISOString(),
        };
        onAdd(bankData);
      });
      
      setIsVerifying(false);
      setPanNumber('');
      onClose();
      
      // Success message
      Alert.alert(
        'Accounts Linked Successfully',
        `${MOCK_BANKS.length} bank accounts have been linked to your profile.`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Bank Account</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Bank Selection */}
            <Text style={styles.label}>Select Your Bank</Text>
            <View style={styles.bankGrid}>
              {POPULAR_BANKS.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={[
                    styles.bankChip,
                    selectedBank === bank.id && styles.bankChipActive,
                  ]}
                  onPress={() => handleSelectBank(bank)}
                >
                  <Ionicons
                    name={bank.icon as any}
                    size={24}
                    color={selectedBank === bank.id ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.bankChipText,
                      selectedBank === bank.id && styles.bankChipTextActive,
                    ]}
                  >
                    {bank.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bank Name (if other selected) */}
            {selectedBank === 'other' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bank Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter bank name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>
            )}

            {/* Account Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                placeholderTextColor={COLORS.textSecondary}
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                maxLength={20}
              />
            </View>

            {/* Current Balance */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Balance</Text>
              <View style={styles.balanceInputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.balanceInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={balance}
                  onChangeText={setBalance}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.addButton,
                (!selectedBank || !accountNumber || !balance) && styles.addButtonDisabled,
              ]}
              onPress={handleAdd}
              disabled={!selectedBank || !accountNumber || !balance}
            >
              <Text style={styles.addButtonText}>Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  bankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  bankChipActive: {
    backgroundColor: COLORS.primaryLight + '15',
    borderColor: COLORS.primary,
  },
  bankChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  bankChipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputGroup: {
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.text,
  },
  balanceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  balanceInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '600',
    color: COLORS.text,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.bodyLarge,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
