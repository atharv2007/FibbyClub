import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { formatINRFull } from '../../utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - (SPACING.md * 2);

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SCREEN_WIDTH / 4) {
          // Swipe threshold met
          if (gestureState.dx > 0 && currentIndex > 0) {
            // Swipe right - go to previous
            goToCard(currentIndex - 1);
          } else if (gestureState.dx < 0 && currentIndex < accounts.length - 1) {
            // Swipe left - go to next
            goToCard(currentIndex + 1);
          } else {
            // Snap back
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const goToCard = (index: number) => {
    const direction = index > currentIndex ? -1 : 1;
    
    // Rotate animation
    Animated.timing(rotateAnim, {
      toValue: direction,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(index);
      rotateAnim.setValue(0);
      translateX.setValue(0);
    });
  };

  const handleNext = () => {
    if (currentIndex < accounts.length - 1) {
      goToCard(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      goToCard(currentIndex - 1);
    }
  };

  const currentAccount = accounts[currentIndex];
  const lastUpdated = currentAccount
    ? new Date(currentAccount.last_updated).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const opacity = rotateAnim.interpolate({
    inputRange: [-1, -0.5, 0, 0.5, 1],
    outputRange: [0.3, 0.6, 1, 0.6, 0.3],
  });

  return (
    <View style={styles.container}>
      {/* Card Carousel */}
      <View style={styles.carouselContainer} {...panResponder.panHandlers}>
        {/* Background cards (stacked effect) */}
        {accounts.length > 1 && (
          <>
            {currentIndex < accounts.length - 1 && (
              <View style={[styles.shadowCard, styles.shadowCardRight]}>
                <View style={styles.shadowCardInner}>
                  <Ionicons name="chevron-forward" size={32} color={COLORS.textSecondary} />
                </View>
              </View>
            )}
            {currentIndex > 0 && (
              <View style={[styles.shadowCard, styles.shadowCardLeft]}>
                <View style={styles.shadowCardInner}>
                  <Ionicons name="chevron-back" size={32} color={COLORS.textSecondary} />
                </View>
              </View>
            )}
          </>
        )}

        {/* Main card */}
        <Animated.View
          style={[
            styles.mainCardWrapper,
            {
              transform: [
                { translateX },
                { perspective: 1000 },
                { rotateY: rotation },
              ],
              opacity,
            },
          ]}
        >
          <Card style={styles.mainCard} shadow="md">
            <View style={styles.header}>
              <View style={styles.bankInfo}>
                <View style={styles.bankLogo}>
                  <Text style={styles.bankLogoText}>
                    {currentAccount.bank_name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.bankName}>{currentAccount.bank_name}</Text>
                  <Text style={styles.accountNumber}>{currentAccount.account_number}</Text>
                </View>
              </View>
              
              {/* 3-dot menu */}
              <TouchableOpacity
                onPress={() => setShowMenu(true)}
                style={styles.menuButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balance}>{formatINRFull(currentAccount.balance)}</Text>
              <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
            </View>

            {/* Carousel indicators */}
            {accounts.length > 1 && (
              <View style={styles.indicatorContainer}>
                {accounts.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentIndex && styles.indicatorActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </Card>
        </Animated.View>
      </View>

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
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    height: 200,
    position: 'relative',
  },
  carouselContainer: {
    height: '100%',
    position: 'relative',
  },
  shadowCard: {
    position: 'absolute',
    top: 10,
    height: 168,
    width: CARD_WIDTH * 0.85,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },
  shadowCardLeft: {
    left: -20,
    transform: [{ rotate: '-5deg' }],
  },
  shadowCardRight: {
    right: -20,
    transform: [{ rotate: '5deg' }],
  },
  shadowCardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCardWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.sm,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  indicatorActive: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  navButton: {
    position: 'absolute',
    top: '40%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  navButtonLeft: {
    left: -10,
  },
  navButtonRight: {
    right: -10,
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
