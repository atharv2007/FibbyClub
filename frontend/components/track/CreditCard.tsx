import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { formatINRFull, formatINR } from '../../utils/format';

interface CreditInfo {
  score: number;
  totalLimit: number;
  availableCredit: number;
  currentSpend: number;
  points: number;
}

interface CreditCardProps {
  creditInfo: CreditInfo;
}

export function CreditCard({ creditInfo }: CreditCardProps) {
  const utilizationPercentage = (creditInfo.currentSpend / creditInfo.totalLimit) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (utilizationPercentage / 100) * circumference;

  // Determine credit score health color
  const getScoreColor = (score: number) => {
    if (score >= 750) return COLORS.success;
    if (score >= 650) return COLORS.warning;
    return COLORS.danger;
  };

  const scoreColor = getScoreColor(creditInfo.score);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Credit Score Card */}
      <View style={styles.scoreCard}>
        <LinearGradient
          colors={['#1E293B', '#334155']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.scoreLabel}>Credit Score</Text>
              <Text style={styles.scoreSubtitle}>Excellent</Text>
            </View>
            <Ionicons name="shield-checkmark" size={28} color={scoreColor} />
          </View>

          <View style={styles.scoreDisplay}>
            <View style={styles.scoreRingContainer}>
              <Svg width={120} height={120}>
                {/* Background circle */}
                <Circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#334155"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Score circle */}
                <Circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke={scoreColor}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (creditInfo.score / 850) * circumference}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </Svg>
              <View style={styles.scoreCenter}>
                <Text style={styles.scoreValue}>{creditInfo.score}</Text>
                <Text style={styles.scoreMaxText}>/850</Text>
              </View>
            </View>
          </View>

          <Text style={styles.scoreInsight}>
            Your score is better than 78% of users! 🎉
          </Text>
        </LinearGradient>
      </View>

      {/* Credit Utilization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Credit Utilization</Text>
        <View style={styles.utilizationCard}>
          <View style={styles.utilizationHeader}>
            <View>
              <Text style={styles.utilizationLabel}>Current Usage</Text>
              <Text style={styles.utilizationAmount}>
                {formatINRFull(creditInfo.currentSpend)}
              </Text>
            </View>
            <View style={styles.utilizationBadge}>
              <Text style={styles.utilizationPercentage}>
                {Math.round(utilizationPercentage)}%
              </Text>
            </View>
          </View>

          <View style={styles.utilizationBar}>
            <View style={styles.utilizationBarBackground}>
              <View
                style={[
                  styles.utilizationBarFill,
                  {
                    width: `${utilizationPercentage}%`,
                    backgroundColor:
                      utilizationPercentage < 30
                        ? COLORS.success
                        : utilizationPercentage < 50
                        ? COLORS.warning
                        : COLORS.danger,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.limitInfo}>
            <Text style={styles.limitText}>
              Available: {formatINRFull(creditInfo.availableCredit)}
            </Text>
            <Text style={styles.limitText}>
              Total Limit: {formatINRFull(creditInfo.totalLimit)}
            </Text>
          </View>
        </View>
      </View>

      {/* Rewards & Points */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewards & Points</Text>
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <Ionicons name="gift" size={32} color={COLORS.primary} />
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsValue}>{creditInfo.points.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>Reward Points</Text>
            </View>
          </View>
          <Text style={styles.pointsConversion}>
            ≈ {formatINR(creditInfo.points * 0.25)} cashback value
          </Text>
        </View>
      </View>

      {/* Offers & Capabilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Offers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll}>
          <OfferCard
            title="Swiggy 20% Off"
            subtitle="Valid till Dec 31"
            icon="restaurant"
            color="#FF5733"
          />
          <OfferCard
            title="Flipkart ₹500 Off"
            subtitle="On orders above ₹2000"
            icon="cart"
            color="#2874F0"
          />
          <OfferCard
            title="Uber 15% Off"
            subtitle="Max savings ₹200"
            icon="car"
            color="#000000"
          />
        </ScrollView>
      </View>

      {/* Credit Capabilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Features</Text>
        <View style={styles.capabilitiesGrid}>
          <CapabilityItem icon="flash" label="Instant EMI" color={COLORS.warning} />
          <CapabilityItem icon="shield-checkmark" label="Fraud Protection" color={COLORS.success} />
          <CapabilityItem icon="airplane" label="Travel Insurance" color={COLORS.info} />
          <CapabilityItem icon="wallet" label="Contactless Pay" color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function OfferCard({ title, subtitle, icon, color }: any) {
  return (
    <View style={[styles.offerCard, { borderLeftColor: color }]}>
      <View style={[styles.offerIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.offerTitle}>{title}</Text>
        <Text style={styles.offerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function CapabilityItem({ icon, label, color }: any) {
  return (
    <View style={styles.capabilityItem}>
      <View style={[styles.capabilityIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.capabilityLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreCard: {
    margin: SPACING.md,
  },
  gradientCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  scoreSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scoreDisplay: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  scoreRingContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  scoreMaxText: {
    fontSize: 14,
    color: '#64748B',
  },
  scoreInsight: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  utilizationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  utilizationLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  utilizationAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  utilizationBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  utilizationPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  utilizationBar: {
    marginVertical: SPACING.xs,
  },
  utilizationBarBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  utilizationBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  limitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  pointsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pointsLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  pointsConversion: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  offersScroll: {
    marginTop: SPACING.xs,
  },
  offerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    width: 200,
    borderLeftWidth: 4,
    gap: SPACING.sm,
  },
  offerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  offerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  capabilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  capabilityItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  capabilityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capabilityLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});
