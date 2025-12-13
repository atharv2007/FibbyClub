import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { api } from '../utils/api';
import { formatINRFull } from '../utils/format';
import AddGoalModal from '../components/goals/AddGoalModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.md * 3) / 2;

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
        await api.updateGoal(user._id, editingGoal._id, goalData);
      } else {
        await api.createGoal(user._id, goalData);
      }
      
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
        <Text style={styles.headerTitle}>Your Goals</Text>
        <Text style={styles.headerSubtitle}>Track and achieve your financial targets</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            {/* Overall Achievement Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryTitle}>Overall Progress</Text>
                  <Text style={styles.summarySubtitle}>{goals.length} Active Goals</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                  <Ionicons name="add" size={20} color={COLORS.surface} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.progressSection}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{overallProgress}% Complete</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Saved</Text>
                  <Text style={styles.statValue}>{formatINRFull(totalSaved)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Target</Text>
                  <Text style={styles.statValue}>{formatINRFull(totalTarget)}</Text>
                </View>
              </View>
            </View>

            {/* Goals Grid - 2x3 Layout */}
            <View style={styles.goalsGrid}>
              {goals.map((goal, index) => {
                const progress = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
                const circumference = 2 * Math.PI * 45;
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
                      <Svg width={100} height={100}>
                        <Circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke={COLORS.border}
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <Circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke={COLORS.success}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </Svg>
                      <View style={styles.progressContent}>
                        <Ionicons name={getIconName(goal.icon)} size={28} color={COLORS.success} />
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    fontFamily: 'Urbanist',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Urbanist',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 80,
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
    fontFamily: 'Urbanist',
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
    fontFamily: 'Urbanist',
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
    fontFamily: 'Urbanist',
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'Urbanist',
  },
  summarySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontFamily: 'Urbanist',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'System',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: 'Urbanist',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'System',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  goalCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  progressRing: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'System',
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    minHeight: 34,
    fontFamily: 'Urbanist',
  },
  goalAmounts: {
    alignItems: 'center',
    gap: 2,
  },
  savedAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'System',
  },
  targetAmount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'System',
  },
});