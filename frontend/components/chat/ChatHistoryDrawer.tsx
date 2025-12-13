import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useState, useEffect, useRef } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 400);

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  category: 'Budget' | 'Spending' | 'Goals' | 'Investments' | 'General';
  emoji: string;
  date: Date;
}

interface ChatHistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

const categories = [
  { id: 'all', label: 'All Chats' },
  { id: 'budget', label: 'Budget', emoji: '📊' },
  { id: 'spending', label: 'Spending', emoji: '💰' },
  { id: 'goals', label: 'Goals', emoji: '🎯' },
  { id: 'investments', label: 'Invest', emoji: '💎' },
];

// Get realistic dates
const getRealisticDates = () => {
  const now = new Date();
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  
  const twentyDaysAgo = new Date(now);
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
  
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  return {
    today,
    yesterday,
    threeDaysAgo,
    fiveDaysAgo,
    tenDaysAgo,
    twentyDaysAgo,
    oneMonthAgo,
    twoMonthsAgo,
  };
};

const dates = getRealisticDates();

// Mock chat history data with realistic dates
const mockChatHistory: ChatHistoryItem[] = [
  {
    id: '1',
    title: 'Weekend Spending Analysis',
    preview: "Your weekend spending was ₹8,200. Let me break it down by category for you.",
    timestamp: '2:45 PM',
    category: 'Spending',
    emoji: '💰',
    date: dates.today,
  },
  {
    id: '2',
    title: 'Budget Check for December',
    preview: "You've used 68% of your December budget with 18 days remaining.",
    timestamp: '10:30 AM',
    category: 'Budget',
    emoji: '📊',
    date: dates.today,
  },
  {
    id: '3',
    title: 'Investment Portfolio Review',
    preview: 'Your portfolio grew by ₹24,500 this month. Overall returns: +18.2%',
    timestamp: '6:15 PM',
    category: 'Investments',
    emoji: '💎',
    date: dates.yesterday,
  },
  {
    id: '4',
    title: 'Goa Trip Savings Goal',
    preview: "You're 72% towards your Goa trip goal! Just ₹18,000 more to go.",
    timestamp: '4:20 PM',
    category: 'Goals',
    emoji: '🎯',
    date: dates.yesterday,
  },
  {
    id: '5',
    title: 'Subscription Audit',
    preview: 'Found 7 active subscriptions totaling ₹3,200/month. Want to optimize?',
    timestamp: '11:30 AM',
    category: 'Spending',
    emoji: '🔄',
    date: dates.threeDaysAgo,
  },
  {
    id: '6',
    title: 'SIP Performance Update',
    preview: 'Your mutual fund SIPs have generated 14.5% returns over 6 months.',
    timestamp: '3:45 PM',
    category: 'Investments',
    emoji: '📈',
    date: dates.fiveDaysAgo,
  },
  {
    id: '7',
    title: 'Credit Card Bill Reminder',
    preview: 'HDFC Card bill of ₹28,400 is due in 3 days. Pay now to avoid charges?',
    timestamp: '9:00 AM',
    category: 'General',
    emoji: '💳',
    date: dates.tenDaysAgo,
  },
  {
    id: '8',
    title: 'Monthly Expense Report',
    preview: 'November expenses: ₹45,200. Top category: Food & Dining (₹12,800)',
    timestamp: '7:20 PM',
    category: 'Spending',
    emoji: '📊',
    date: dates.twentyDaysAgo,
  },
  {
    id: '9',
    title: 'Emergency Fund Goal',
    preview: 'Great progress! Your emergency fund now covers 4 months of expenses.',
    timestamp: '1:15 PM',
    category: 'Goals',
    emoji: '🎯',
    date: dates.oneMonthAgo,
  },
  {
    id: '10',
    title: 'Tax Saving Options',
    preview: 'Here are 5 tax-saving investments to maximize your 80C deductions.',
    timestamp: '5:30 PM',
    category: 'Investments',
    emoji: '📄',
    date: dates.twoMonthsAgo,
  },
];

export default function ChatHistoryDrawer({ visible, onClose, onNewChat, onSelectChat }: ChatHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Filter chats based on search and category
  const filteredChats = mockChatHistory.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           chat.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group chats by time period with realistic labels
  const groupChatsByDate = (chats: ChatHistoryItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const groups: { [key: string]: ChatHistoryItem[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Last Week': [],
      'This Month': [],
      'Last Month': [],
      'Older': [],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.date.getFullYear(), chat.date.getMonth(), chat.date.getDate());
      
      if (chatDate.getTime() === today.getTime()) {
        groups['Today'].push(chat);
      } else if (chatDate.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(chat);
      } else if (chatDate >= startOfWeek && chatDate < yesterday) {
        groups['This Week'].push(chat);
      } else if (chatDate >= startOfLastWeek && chatDate < startOfWeek) {
        groups['Last Week'].push(chat);
      } else if (chatDate >= startOfThisMonth && chatDate < startOfWeek) {
        groups['This Month'].push(chat);
      } else if (chatDate >= startOfLastMonth && chatDate < startOfThisMonth) {
        groups['Last Month'].push(chat);
      } else {
        groups['Older'].push(chat);
      }
    });

    return groups;
  };

  const groupedChats = groupChatsByDate(filteredChats);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header with close button */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Conversations</Text>
              <Text style={styles.headerSubtitle}>{filteredChats.length} chats</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={32} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Sticky Section */}
          <View style={styles.stickySection}>
            {/* New Chat Button */}
            <TouchableOpacity style={styles.newChatButton} onPress={onNewChat}>
              <Ionicons name="add" size={20} color={COLORS.surface} />
              <Text style={styles.newChatButtonText}>New Chat</Text>
            </TouchableOpacity>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conversations..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Category Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScrollView}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  {category.emoji && <Text style={styles.categoryEmoji}>{category.emoji}</Text>}
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && styles.categoryLabelActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Scrollable Chat History */}
          <ScrollView style={styles.chatListContainer} showsVerticalScrollIndicator={true}>
            {Object.entries(groupedChats).map(([period, chats]) => {
              if (chats.length === 0) return null;
              
              return (
                <View key={period} style={styles.periodSection}>
                  <View style={styles.periodHeader}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.periodTitle}>{period}</Text>
                  </View>

                  {chats.map((chat) => (
                    <TouchableOpacity
                      key={chat.id}
                      style={styles.chatItem}
                      onPress={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                    >
                      <View style={styles.chatIconContainer}>
                        <Text style={styles.chatIcon}>{chat.emoji}</Text>
                      </View>
                      <View style={styles.chatContent}>
                        <Text style={styles.chatTitle} numberOfLines={1}>
                          {chat.title}
                        </Text>
                        <Text style={styles.chatPreview} numberOfLines={2}>
                          {chat.preview}
                        </Text>
                        <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}

            {filteredChats.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={64} color={COLORS.disabled} />
                <Text style={styles.emptyStateText}>No conversations found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs / 2,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  stickySection: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  newChatButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  newChatButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.heading,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
  },
  categoriesScrollView: {
    marginBottom: SPACING.sm,
  },
  categoriesContainer: {
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.text,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.body,
  },
  categoryLabelActive: {
    color: COLORS.surface,
  },
  chatListContainer: {
    flex: 1,
  },
  periodSection: {
    marginBottom: SPACING.lg,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  periodTitle: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.heading,
    letterSpacing: 0.5,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: {
    fontSize: 20,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.xs,
  },
  chatPreview: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.xs,
  },
  chatTimestamp: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.h4,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
