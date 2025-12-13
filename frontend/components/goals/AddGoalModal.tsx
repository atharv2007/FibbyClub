import React, { useState, useEffect } from 'react';
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
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Goal {
  _id?: string;
  name: string;
  icon: string;
  target_amount: number;
  deadline?: string;
}

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  editGoal?: Goal | null;
}

const GOAL_ICONS = [
  { id: 'airplane', name: 'airplane', label: 'Travel' },
  { id: 'laptop', name: 'laptop', label: 'Laptop' },
  { id: 'shield-checkmark', name: 'shield-checkmark', label: 'Emergency' },
  { id: 'car-sport', name: 'car-sport', label: 'Car' },
  { id: 'home', name: 'home', label: 'Home' },
  { id: 'school', name: 'school', label: 'Education' },
  { id: 'heart', name: 'heart', label: 'Wedding' },
  { id: 'phone-portrait', name: 'phone-portrait', label: 'Phone' },
  { id: 'bicycle', name: 'bicycle', label: 'Bike' },
  { id: 'game-controller', name: 'game-controller', label: 'Gaming' },
  { id: 'fitness', name: 'fitness', label: 'Fitness' },
  { id: 'medical', name: 'medical', label: 'Medical' },
];

export default function AddGoalModal({ visible, onClose, onSave, editGoal }: AddGoalModalProps) {
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('airplane');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (visible) {
      // Populate fields if editing
      if (editGoal) {
        setName(editGoal.name);
        setTargetAmount(editGoal.target_amount.toString());
        setSelectedIcon(editGoal.icon);
        setDeadline(editGoal.deadline || '');
      } else {
        // Reset fields for new goal
        setName('');
        setTargetAmount('');
        setSelectedIcon('airplane');
        setDeadline('');
      }
      
      // Slide up animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, editGoal]);

  const handleSave = () => {
    if (!name.trim() || !targetAmount) return;

    const goal: Goal = {
      name: name.trim(),
      icon: selectedIcon,
      target_amount: parseFloat(targetAmount),
      deadline: deadline || undefined,
    };

    if (editGoal?._id) {
      goal._id = editGoal._id;
    }

    onSave(goal);
    onClose();
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    setTargetAmount(numericValue);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
              >
                {/* Handle Bar */}
                <View style={styles.handleBar} />

                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>
                    {editGoal ? 'Edit Goal' : 'Add New Goal'}
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.content}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Goal Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Goal Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Goa Trip, New Laptop"
                      placeholderTextColor={COLORS.textSecondary}
                      value={name}
                      onChangeText={setName}
                      maxLength={50}
                    />
                  </View>

                  {/* Target Amount */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Target Amount</Text>
                    <View style={styles.amountInputWrapper}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <TextInput
                        style={styles.amountInput}
                        placeholder="0"
                        placeholderTextColor={COLORS.textSecondary}
                        value={targetAmount}
                        onChangeText={formatAmount}
                        keyboardType="number-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>

                  {/* Icon Selection */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Choose Icon</Text>
                    <View style={styles.iconGrid}>
                      {GOAL_ICONS.map((icon) => (
                        <TouchableOpacity
                          key={icon.id}
                          style={[
                            styles.iconOption,
                            selectedIcon === icon.name && styles.iconOptionSelected,
                          ]}
                          onPress={() => setSelectedIcon(icon.name)}
                        >
                          <Ionicons
                            name={icon.name as any}
                            size={28}
                            color={
                              selectedIcon === icon.name
                                ? COLORS.primary
                                : COLORS.textSecondary
                            }
                          />
                          <Text
                            style={[
                              styles.iconLabel,
                              selectedIcon === icon.name && styles.iconLabelSelected,
                            ]}
                          >
                            {icon.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Deadline (Optional) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      Target Date <Text style={styles.optional}>(Optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Dec 2025"
                      placeholderTextColor={COLORS.textSecondary}
                      value={deadline}
                      onChangeText={setDeadline}
                      maxLength={30}
                    />
                  </View>

                  <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (!name.trim() || !targetAmount) && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={!name.trim() || !targetAmount}
                  >
                    <Text style={styles.saveButtonText}>
                      {editGoal ? 'Update Goal' : 'Create Goal'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: SCREEN_HEIGHT * 0.9,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  keyboardView: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
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
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  optional: {
    color: COLORS.textSecondary,
    fontWeight: '400',
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
  amountInputWrapper: {
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
  amountInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '600',
    color: COLORS.text,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  iconOption: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  iconOptionSelected: {
    backgroundColor: COLORS.primaryLight + '20',
    borderColor: COLORS.primary,
  },
  iconLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  iconLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 120,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.bodyLarge,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
