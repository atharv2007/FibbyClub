import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { api } from '../utils/api';
import { formatINRFull } from '../utils/format';

interface Goal {
  _id: string;
  name: string;
  icon: string;
  target_amount: number;
  saved_amount: number;
  auto_save_enabled: boolean;
}

export default function GoalsScreen() {
  const { user } = useAppStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const goalsData = await api.getGoals(user._id);
      setGoals(goalsData);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      beach: 'sunny',
      laptop: 'laptop',
      shield: 'shield-checkmark',
    };
    return iconMap[icon] || 'star';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Goals</Text>
        <Text style={styles.headerSubtitle}>Your financial targets</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.goalsGrid}>
          {goals.map((goal) => {
            const progress = (goal.saved_amount / goal.target_amount) * 100;
            const circumference = 2 * Math.PI * 50;
            const strokeDashoffset = circumference - (progress / 100) * circumference;

            return (
              <TouchableOpacity key={goal._id} style={styles.goalCard}>
                <View style={styles.progressRing}>
                  <Svg width={120} height={120}>
                    <Circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={COLORS.border}
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <Circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={COLORS.primary}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </Svg>
                  <View style={styles.progressContent}>
                    <Ionicons name={getIconName(goal.icon)} size={28} color={COLORS.primary} />
                    <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                  </View>
                </View>

                <Text style={styles.goalName}>{goal.name}</Text>
                <View style={styles.goalAmounts}>
                  <Text style={styles.savedAmount}>{formatINRFull(goal.saved_amount)}</Text>
                  <Text style={styles.targetAmount}>of {formatINRFull(goal.target_amount)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  goalCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressRing: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  goalName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  goalAmounts: {
    alignItems: 'center',
    gap: 2,
  },
  savedAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  targetAmount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 80,
  },
});
