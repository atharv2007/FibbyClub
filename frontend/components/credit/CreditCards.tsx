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
    return `Due in ${diffDays} days`;
  };

  const utilizationPercentage = (card: CreditCard) => {
    return Math.round((card.outstanding / card.credit_limit) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 70) return '#EF4444';
    if (percentage >= 30) return '#F59E0B';
    return '#10B981';
  };

  const handleFeatureClick = (feature: CardFeature, card: CreditCard) => {
    setSelectedFeature(feature);
    setSelectedCard(card);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="card" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Your Credit Cards</Text>
      </View>

      {cards.map((card) => {
        const utilization = utilizationPercentage(card);
        const utilizationColor = getUtilizationColor(utilization);

        return (
          <View key={card._id} style={styles.cardContainer}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardLogo}>
                <Text style={styles.cardLogoText}>{card.bank.charAt(0)}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.card_name}</Text>
                <Text style={styles.cardNumber}>•••• {card.last_four}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Ionicons name="gift" size={14} color={COLORS.primary} />
                <Text style={styles.pointsText}>{card.reward_points.toLocaleString()}</Text>
              </View>
            </View>

            {/* Credit Info */}
            <View style={styles.creditInfo}>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Available</Text>
                <Text style={styles.creditValue}>₹{card.available_credit.toLocaleString()}</Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Outstanding</Text>
                <Text style={[styles.creditValue, { color: '#EF4444' }]}>₹{card.outstanding.toLocaleString()}</Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Limit</Text>
                <Text style={styles.creditValue}>₹{card.credit_limit.toLocaleString()}</Text>
              </View>
            </View>

            {/* Utilization Bar */}
            <View style={styles.utilizationContainer}>
              <View style={styles.utilizationHeader}>
                <Text style={styles.utilizationLabel}>Utilization</Text>
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

            {/* Due Date */}
            <View style={styles.dueContainer}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.dueText}>{formatDueDate(card.due_date)}</Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Rewards & Benefits</Text>
              <View style={styles.featuresGrid}>
                {card.features.map((feature, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.featureChip}
                    onPress={() => handleFeatureClick(feature, card)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={feature.icon as any} size={18} color={COLORS.primary} />
                    <View style={styles.featureInfo}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureValue}>{feature.value}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      })}

      {/* Feature Detail Modal - Bottom Sheet */}
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
                    <Ionicons name={selectedFeature.icon as any} size={32} color={COLORS.primary} />
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
                
                <ScrollView style={styles.modalBody}>
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
    paddingVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
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
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  creditInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  creditRow: {
    flex: 1,
    alignItems: 'center',
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
    marginBottom: SPACING.md,
  },
  dueText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  featuresTitle: {
    fontSize: 13,
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
    gap: SPACING.sm,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureValue: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  // Modal Styles
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
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    padding: SPACING.xs,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  modalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  modalBody: {
    marginBottom: SPACING.lg,
  },
  modalDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  modalFooter: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalCardInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});