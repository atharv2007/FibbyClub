import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { api } from '../utils/api';
import { formatINRFull } from '../utils/format';
import AddGoalModal from '../components/goals/AddGoalModal';

interface Goal {
  _id: string;
  name: string;
  icon: string;
  target_amount: number;
  saved_amount: number;
  auto_save_enabled: boolean;
  deadline?: string;
}

export default function GoalsScreen() {
  const { user } = useAppStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const fabScale = useRef(new Animated.Value(1)).current;

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

  const handleSaveGoal = async (goalData: any) => {
    if (!user?._id) return;
    
    try {
      if (editingGoal?._id) {
        // Update existing goal
        await api.updateGoal(user._id, editingGoal._id, goalData);
      } else {
        // Create new goal
        await api.createGoal(user._id, goalData);
      }
      
      // Reload goals
      await loadGoals();
      setShowAddModal(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowAddModal(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user?._id) return;
    
    try {
      await api.deleteGoal(user._id, goalId);
      await loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      Alert.alert('Error', 'Failed to delete goal. Please try again.');
    }
  };

  const handleAddNew = () => {
    setEditingGoal(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingGoal(null);
  };

  const animateFab = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    const validIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
      airplane: 'airplane',
      laptop: 'laptop',
      'shield-checkmark': 'shield-checkmark',
      'car-sport': 'car-sport',
      home: 'home',
      school: 'school',
      heart: 'heart',
      'phone-portrait': 'phone-portrait',
      bicycle: 'bicycle',
      'game-controller': 'game-controller',
      fitness: 'fitness',
      medical: 'medical',
      beach: 'airplane',
      shield: 'shield-checkmark',
      car: 'car-sport',
    };
    return validIcons[icon] || 'star';
  };

  // Calculate overall achievement percentage
  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalSaved = goals.reduce((sum, goal) => sum + goal.saved_amount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
    return totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved_amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Goals</Text>
          <Text style={styles.headerSubtitle}>Track your financial targets</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {goals.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="trophy" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start planning your financial future by creating your first goal
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
              <Ionicons name="add-circle" size={24} color={COLORS.surface} />
              <Text style={styles.emptyButtonText}>Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Overall Achievement Card */}
            <View style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <Ionicons name="bar-chart" size={24} color={COLORS.primary} />
                <Text style={styles.achievementTitle}>Overall Progress</Text>
              </View>
              <View style={styles.achievementContent}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
                </View>
                <Text style={styles.progressLabel}>{overallProgress}% Complete</Text>
              </View>
              <View style={styles.achievementStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Saved</Text>
                  <Text style={styles.statValue}>{formatINRFull(totalSaved)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Target</Text>
                  <Text style={styles.statValue}>{formatINRFull(totalTarget)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Goals</Text>
                  <Text style={styles.statValue}>{goals.length}</Text>
                </View>
              </View>
            </View>

            {/* Add Goal CTA Button */}
            <TouchableOpacity style={styles.addGoalCTA} onPress={handleAddNew} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              <Text style={styles.addGoalCTAText}>Add New Goal</Text>
            </TouchableOpacity>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Goals</Text>
            </View>

            {/* Goals Grid */}
            <View style={styles.goalsGrid}>
              {goals.map((goal) => {
                const progress = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
                const circumference = 2 * Math.PI * 50;
                const strokeDashoffset = circumference - (progress / 100) * circumference;

                return (
                  <TouchableOpacity
                    key={goal._id}
                    style={styles.goalCard}
                    onPress={() => handleEditGoal(goal)}
                    activeOpacity={0.7}
                  >
                    {/* Progress Ring */}
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
                          stroke={COLORS.success}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                        />
                      </Svg>
                      <View style={styles.progressContent}>
                        <Ionicons name={getIconName(goal.icon)} size={32} color={COLORS.success} />
                        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                      </View>
                    </View>

                    {/* Goal Info */}
                    <Text style={styles.goalName} numberOfLines={2}>
                      {goal.name}
                    </Text>
                    <View style={styles.goalAmounts}>
                      <Text style={styles.savedAmount}>{formatINRFull(goal.saved_amount)}</Text>
                      <Text style={styles.targetAmount}>of {formatINRFull(goal.target_amount)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add/Edit Goal Modal */}
      <AddGoalModal
        visible={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
        editGoal={editingGoal}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.button,
    ...SHADOWS.card,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  achievementCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  achievementContent: {
    marginBottom: SPACING.md,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.full,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  addGoalCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.button,
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addGoalCTAText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  goalCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.soft,
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
    minHeight: 38,
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
    height: 100,
  },
});