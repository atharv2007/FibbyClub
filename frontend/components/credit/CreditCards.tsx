import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface CardFeature {
  icon: string;
  title: string;
  value: string;
  description: string;
}

interface CreditCard {
  _id: string;
  card_name: string;
  card_type: string;
  bank: string;
  last_four: string;
  credit_limit: number;
  available_credit: number;
  outstanding: number;
  due_date: string;
  reward_points: number;
  features: CardFeature[];
}

interface CreditCardsProps {
  cards: CreditCard[];
}

export function CreditCards({ cards }: CreditCardsProps) {
  const [selectedFeature, setSelectedFeature] = useState<CardFeature | null>(null);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days left`;
  };

  const utilizationPercentage = (card: CreditCard) => {
    return Math.round((card.outstanding / card.credit_limit) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 70) return '#EF4444';
    if (percentage >= 30) return '#F59E0B';
    return '#10B981';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cards</Text>
        <Text style={styles.subtitle}>{cards.length} active card{cards.length !== 1 ? 's' : ''}</Text>
      </View>

      {cards.map((card) => {
        const utilization = utilizationPercentage(card);
        const utilizationColor = getUtilizationColor(utilization);

        return (
          <View key={card._id} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLogo}>
                <Text style={styles.cardLogoText}>{card.bank.charAt(0)}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.card_name}</Text>
                <Text style={styles.cardNumber}>•••• {card.last_four}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Ionicons name="gift" size={12} color={COLORS.primary} />
                <Text style={styles.pointsText}>{(card.reward_points / 1000).toFixed(1)}K</Text>
              </View>
            </View>

            <View style={styles.creditInfo}>
              <View style={styles.creditItem}>
                <Text style={styles.creditLabel}>Available</Text>
                <Text style={styles.creditValue}>₹{(card.available_credit / 1000).toFixed(0)}K</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.creditItem}>
                <Text style={styles.creditLabel}>Outstanding</Text>
                <Text style={[styles.creditValue, { color: '#EF4444' }]}>₹{(card.outstanding / 1000).toFixed(0)}K</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.creditItem}>
                <Text style={styles.creditLabel}>Limit</Text>
                <Text style={styles.creditValue}>₹{(card.credit_limit / 1000).toFixed(0)}K</Text>
              </View>
            </View>

            <View style={styles.utilizationContainer}>
              <View style={styles.utilizationHeader}>
                <Text style={styles.utilizationLabel}>Credit Used</Text>
                <Text style={[styles.utilizationValue, { color: utilizationColor }]}>
                  {utilization}%
                </Text>
              </View>
              <View style={styles.utilizationBar}>
                <View 
                  style={[
                    styles.utilizationFill, 
                    { width: `${utilization}%`, backgroundColor: utilizationColor }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.dueContainer}>
              <Ionicons name="time" size={14} color={COLORS.textSecondary} />
              <Text style={styles.dueText}>{formatDueDate(card.due_date)}</Text>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Benefits</Text>
              <View style={styles.featuresGrid}>
                {card.features.map((feature, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.featureChip}
                    onPress={() => {
                      setSelectedFeature(feature);
                      setSelectedCard(card);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={feature.icon as any} size={16} color={COLORS.primary} />
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      })}

      <Modal
        visible={!!selectedFeature}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedFeature(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1}
            onPress={() => setSelectedFeature(null)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            
            {selectedFeature && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    <Ionicons name={selectedFeature.icon as any} size={28} color={COLORS.primary} />
                  </View>
                  <TouchableOpacity 
                    style={styles.modalClose}
                    onPress={() => setSelectedFeature(null)}
                  >
                    <Ionicons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>{selectedFeature.title}</Text>
                <Text style={styles.modalValue}>{selectedFeature.value}</Text>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalDescription}>{selectedFeature.description}</Text>
                </ScrollView>

                {selectedCard && (
                  <View style={styles.modalFooter}>
                    <Text style={styles.modalCardInfo}>
                      {selectedCard.card_name} • •••• {selectedCard.last_four}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cardLogo: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  creditInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  creditItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  creditLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  creditValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  utilizationContainer: {
    marginBottom: SPACING.sm,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  utilizationLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  utilizationValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  utilizationBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  utilizationFill: {
    height: '100%',
    borderRadius: 3,
  },
  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  dueText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featuresGrid: {
    gap: SPACING.xs,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  featureTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: '75%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: SPACING.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    padding: SPACING.xs,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  modalBody: {
    marginBottom: SPACING.md,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modalFooter: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalCardInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});