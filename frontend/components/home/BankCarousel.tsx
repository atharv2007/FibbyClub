import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { formatINRFull } from '../../utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - (SPACING.md * 2);
const CARD_SPACING = SPACING.md;

interface BankAccount {
  _id: string;
  bank_name: string;
  account_number: string;
  balance: number;
  last_updated: string;
}

interface BankCarouselProps {
  accounts: BankAccount[];
  onAddBank: () => void;
}

export function BankCarousel({ accounts, onAddBank }: BankCarouselProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real card)
  const isScrolling = useRef(false);

  // Create infinite loop by adding last card at start and first card at end
  const infiniteAccounts = accounts.length > 1 
    ? [accounts[accounts.length - 1], ...accounts, accounts[0]]
    : accounts;

  // Initialize scroll position to first real card
  useEffect(() => {
    if (accounts.length > 1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: (CARD_WIDTH + CARD_SPACING) * 1,
          animated: false,
        });
      }, 100);
    }
  }, [accounts.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    setCurrentIndex(index);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (accounts.length <= 1 || isScrolling.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));

    // If at the duplicate last card (index 0), jump to real last card
    if (index === 0) {
      isScrolling.current = true;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: (CARD_WIDTH + CARD_SPACING) * accounts.length,
          animated: false,
        });
        isScrolling.current = false;
      }, 50);
    }
    // If at the duplicate first card (index = accounts.length + 1), jump to real first card
    else if (index === accounts.length + 1) {
      isScrolling.current = true;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: (CARD_WIDTH + CARD_SPACING) * 1,
          animated: false,
        });
        isScrolling.current = false;
      }, 50);
    }
  };

  const renderBankCard = (account: BankAccount, displayIndex: number, originalIndex: number) => {
    const lastUpdated = new Date(account.last_updated).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View key={`${account._id}-${displayIndex}`} style={styles.cardContainer}>
        <Card style={styles.mainCard} shadow="md">
          <View style={styles.header}>
            <View style={styles.bankInfo}>
              <View style={styles.bankLogo}>
                <Text style={styles.bankLogoText}>
                  {account.bank_name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.bankName}>{account.bank_name}</Text>
                <Text style={styles.accountNumber}>{account.account_number}</Text>
              </View>
            </View>
            
            {/* 3-dot menu */}
            <TouchableOpacity
              onPress={() => {
                setSelectedAccountIndex(originalIndex);
                setShowMenu(true);
              }}
              style={styles.menuButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {infiniteAccounts.map((account, displayIndex) => {
          // Calculate the original index for the menu
          let originalIndex = displayIndex;
          if (accounts.length > 1) {
            if (displayIndex === 0) {
              originalIndex = accounts.length - 1; // Last card duplicate
            } else if (displayIndex === accounts.length + 1) {
              originalIndex = 0; // First card duplicate
            } else {
              originalIndex = displayIndex - 1; // Real cards
            }
          }
          return renderBankCard(account, displayIndex, originalIndex);
        })}
      </ScrollView>

      {/* 3-dot menu dropdown */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onAddBank();
              }}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Add a Bank</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: CARD_SPACING,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  mainCard: {
    height: 180,
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
  menuButton: {
    padding: SPACING.xs,
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 120,
    paddingRight: SPACING.md + 20,
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    minWidth: 160,
    ...SHADOWS.elevated,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
});
