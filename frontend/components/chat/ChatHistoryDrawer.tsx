import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { useState } from 'react';

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
  { id: 'all', label: 'All', emoji: '' },
  { id: 'budget', label: 'Budget', emoji: '📊' },
  { id: 'spending', label: 'Spending', emoji: '💰' },
  { id: 'goals', label: 'Goals', emoji: '🎯' },
];

// Mock chat history data
const mockChatHistory: ChatHistoryItem[] = [
  {
    id: '1',
    title: 'Budget Analysis',
    preview: "Looking at your monthly budget, you've used 72% so far...",
    timestamp: 'Dec 13, 11:46 PM',
    category: 'Budget',
    emoji: '📊',
    date: new Date('2024-12-13'),
  },
  {
    id: '2',
    title: 'Weekend Spending Review',
    preview: 'Looks like you had quite a weekend! Your spending was higher than usual.',
    timestamp: 'Dec 11, 11:46 PM',
    category: 'Spending',
    emoji: '💰',
    date: new Date('2024-12-11'),
  },
  {
    id: '3',
    title: 'New Laptop Goal',
    preview: "I've created a savings goal for your new laptop. Let's aim for ₹80,000.",
    timestamp: 'Dec 8, 11:46 PM',
    category: 'Goals',
    emoji: '🎯',
    date: new Date('2024-12-08'),
  },
  {
    id: '4',
    title: 'Investment Portfolio Review',
    preview: 'Your portfolio is performing well with 18.2% returns this year.',
    timestamp: 'Dec 5, 3:20 PM',
    category: 'Investments',
    emoji: '💎',
    date: new Date('2024-12-05'),
  },
  {
    id: '5',
    title: 'Subscription Management',
    preview: 'Found 5 active subscriptions totaling ₹2,400 per month.',
    timestamp: 'Nov 28, 9:15 AM',
    category: 'Spending',
    emoji: '🔄',
    date: new Date('2024-11-28'),
  },
  {
    id: '6',
    title: 'Tax Saving Tips',
    preview: 'Here are some tax-saving investment options for this financial year.',
    timestamp: 'Nov 20, 2:30 PM',
    category: 'General',
    emoji: '📄',
    date: new Date('2024-11-20'),
  },
];

export default function ChatHistoryDrawer({ visible, onClose, onNewChat, onSelectChat }: ChatHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter chats based on search and category
  const filteredChats = mockChatHistory.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           chat.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group chats by time period
  const groupChatsByDate = (chats: ChatHistoryItem[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    const groups: { [key: string]: ChatHistoryItem[] } = {
      TODAY: [],
      'THIS WEEK': [],
      'LAST WEEK': [],
      OLDER: [],
    };

    chats.forEach((chat) => {
      const chatDate = chat.date;
      const isToday = chatDate.toDateString() === today.toDateString();
      const isThisWeek = chatDate >= lastWeek && chatDate < today;
      const isLastWeek = chatDate >= lastMonth && chatDate < lastWeek;

      if (isToday) {
        groups.TODAY.push(chat);
      } else if (isThisWeek) {
        groups['THIS WEEK'].push(chat);
      } else if (isLastWeek) {
        groups['LAST WEEK'].push(chat);
      } else {
        groups.OLDER.push(chat);
      }
    });

    return groups;
  };

  const groupedChats = groupChatsByDate(filteredChats);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.card * 2,
    borderTopRightRadius: RADIUS.card * 2,
    height: '90%',
    paddingTop: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
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
