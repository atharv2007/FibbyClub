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
  ActivityIndicator,
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
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={40} color={COLORS.primary} />
              <Text style={styles.infoTitle}>Secure Account Linking</Text>
              <Text style={styles.infoText}>
                We use Account Aggregator (AA) service to securely fetch your bank accounts using your PAN card number.
              </Text>
            </View>

            {/* PAN Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="ABCDE1234F"
                placeholderTextColor={COLORS.textSecondary}
                value={panNumber}
                onChangeText={(text) => setPanNumber(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={10}
              />
              <Text style={styles.helpText}>
                Enter your 10-character PAN card number
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>100% Secure & Encrypted</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>RBI Approved AA Service</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>Auto-fetch All Accounts</Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.addButton,
                (panNumber.length !== 10 || isVerifying) && styles.addButtonDisabled,
              ]}
              onPress={handleVerifyPAN}
              disabled={panNumber.length !== 10 || isVerifying}
            >
              {isVerifying ? (
                <>
                  <ActivityIndicator size="small" color={COLORS.surface} style={{ marginRight: 8 }} />
                  <Text style={styles.addButtonText}>Verifying PAN...</Text>
                </>
              ) : (
                <Text style={styles.addButtonText}>Link Bank Accounts</Text>
              )}
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
  infoCard: {
    backgroundColor: COLORS.primaryLight + '15',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
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
  helpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  featuresContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  featureText: {
    fontSize: TYPOGRAPHY.bodySmall,
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
