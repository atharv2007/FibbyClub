import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Animated, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHIP_WIDTH = 220; // Average chip width including gap

interface SuggestionChip {
  id: string;
  label: string;
  emoji: string;
}

const suggestionChipsRow1: SuggestionChip[] = [
  { id: '1', emoji: '📊', label: 'Analyze my weekend spend' },
  { id: '2', emoji: '✈️', label: 'Can I afford a Goa trip?' },
  { id: '3', emoji: '📈', label: 'Show my SIPs' },
  { id: '4', emoji: '💰', label: 'How is my budget?' },
  { id: '5', emoji: '🎯', label: 'Track my savings goal' },
  { id: '6', emoji: '💳', label: 'Review my credit cards' },
  { id: '7', emoji: '🏡', label: 'Check home loan status' },
  { id: '8', emoji: '📉', label: 'Analyze spending trends' },
];

const suggestionChipsRow2: SuggestionChip[] = [
  { id: '9', emoji: '💰', label: 'How is my budget?' },
  { id: '10', emoji: '🛑', label: 'Set a spending limit' },
  { id: '11', emoji: '🔍', label: 'Where did my money go?' },
  { id: '12', emoji: '💸', label: 'Forecast my balance' },
  { id: '13', emoji: '🔔', label: 'Set bill reminders' },
  { id: '14', emoji: '🎁', label: 'Split an expense' },
  { id: '15', emoji: '📊', label: 'Show category breakdown' },
  { id: '16', emoji: '💎', label: 'Investment recommendations' },
];

const suggestionChipsRow3: SuggestionChip[] = [
  { id: '17', emoji: '🔄', label: 'Check my subscriptions' },
  { id: '18', emoji: '💎', label: 'Show my portfolio' },
  { id: '19', emoji: '💎', label: 'Review my investments' },
  { id: '20', emoji: '📱', label: 'Bill payment reminders' },
  { id: '21', emoji: '🏦', label: 'Account summary' },
  { id: '22', emoji: '🎓', label: 'Education fund progress' },
  { id: '23', emoji: '🚗', label: 'Car loan EMI details' },
  { id: '24', emoji: '⚡', label: 'Quick expense entry' },
];

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Animation values for scrolling rows
  const scrollAnim1 = useRef(new Animated.Value(0)).current;
  const scrollAnim2 = useRef(new Animated.Value(0)).current;
  const scrollAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Calculate the width needed for one complete set of chips
    const row1Width = suggestionChipsRow1.length * CHIP_WIDTH;
    const row2Width = suggestionChipsRow2.length * CHIP_WIDTH;
    const row3Width = suggestionChipsRow3.length * CHIP_WIDTH;

    // Row 1 - Scroll left (negative direction) - infinite loop
    const anim1 = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollAnim1, {
          toValue: -row1Width,
          duration: 25000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollAnim1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim1.start();

    // Row 2 - Scroll right (positive direction) - infinite loop
    const anim2 = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollAnim2, {
          toValue: row2Width,
          duration: 25000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollAnim2, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim2.start();

    // Row 3 - Scroll left (negative direction) - infinite loop
    const anim3 = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollAnim3, {
          toValue: -row3Width,
          duration: 25000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollAnim3, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      setShowWelcome(false);
      // TODO: Implement chat message sending
      console.log('Sending message:', inputText);
      setInputText('');
    }
  };

  const handleChipPress = (chip: SuggestionChip) => {
    setInputText(chip.label);
    setShowWelcome(false);
    // TODO: Auto-send or let user edit
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Image 
            source={require('../assets/fibbylogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.headerTitle}>Fibby</Text>
            <Text style={styles.headerSubtitle}>Your money buddy</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {showWelcome && (
          <View style={styles.welcomeContainer}>
            {/* Large Fibby Icon */}
            <View style={styles.fibbyIconLarge}>
              <Image 
                source={require('../assets/fibbylogo.png')} 
                style={styles.fibbyIconImage}
                resizeMode="contain"
              />
            </View>

            {/* Welcome Text */}
            <Text style={styles.welcomeTitle}>Ask Fibby anything</Text>
            <Text style={styles.welcomeSubtitle}>Your AI-powered money buddy</Text>

            {/* Animated Suggestion Chips */}
            <View style={styles.suggestionsContainer}>
              {/* Row 1 - Scrolls Left */}
              <View style={styles.suggestionRow}>
                <Animated.View
                  style={[
                    styles.animatedRow,
                    { transform: [{ translateX: scrollAnim1 }] },
                  ]}
                >
                  {[...suggestionChipsRow1, ...suggestionChipsRow1].map((chip, index) => (
                    <TouchableOpacity
                      key={`${chip.id}-${index}`}
                      style={styles.chip}
                      onPress={() => handleChipPress(chip)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.chipEmoji}>{chip.emoji}</Text>
                      <Text style={styles.chipText}>{chip.label}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>

              {/* Row 2 - Scrolls Right */}
              <View style={styles.suggestionRow}>
                <Animated.View
                  style={[
                    styles.animatedRow,
                    { transform: [{ translateX: scrollAnim2 }] },
                  ]}
                >
                  {[...suggestionChipsRow2, ...suggestionChipsRow2].map((chip, index) => (
                    <TouchableOpacity
                      key={`${chip.id}-${index}`}
                      style={styles.chip}
                      onPress={() => handleChipPress(chip)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.chipEmoji}>{chip.emoji}</Text>
                      <Text style={styles.chipText}>{chip.label}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>

              {/* Row 3 - Scrolls Left */}
              <View style={styles.suggestionRow}>
                <Animated.View
                  style={[
                    styles.animatedRow,
                    { transform: [{ translateX: scrollAnim3 }] },
                  ]}
                >
                  {[...suggestionChipsRow3, ...suggestionChipsRow3].map((chip, index) => (
                    <TouchableOpacity
                      key={`${chip.id}-${index}`}
                      style={styles.chip}
                      onPress={() => handleChipPress(chip)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.chipEmoji}>{chip.emoji}</Text>
                      <Text style={styles.chipText}>{chip.label}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>
            </View>
          </View>
        )}

        {!showWelcome && (
          <View style={styles.chatContainer}>
            {/* TODO: Chat messages will go here */}
            <Text style={styles.comingSoon}>Chat messages coming soon...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask Fibby anything..."
            placeholderTextColor={COLORS.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={COLORS.surface} />
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuButton: {
    padding: SPACING.xs,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  fibbyIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: SPACING.md,
  },
  fibbyIconImage: {
    width: '100%',
    height: '100%',
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  suggestionsContainer: {
    width: SCREEN_WIDTH,
    marginTop: SPACING.lg,
  },
  suggestionRow: {
    height: 48,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  animatedRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    paddingVertical: SPACING.sm,
  },
  micButton: {
    padding: SPACING.xs,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
});