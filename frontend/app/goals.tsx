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

  const handleDeleteGoal = (goal: Goal) => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user?._id) return;
            
            try {
              await api.deleteGoal(user._id, goal._id);
              await loadGoals();
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
            }
          },
        },
      ]
    );
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
    // Direct mapping - use the icon name as-is if it's valid
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
      // Legacy mappings
      beach: 'airplane',
      shield: 'shield-checkmark',
      car: 'car-sport',
    };
    return validIcons[icon] || 'star';
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Goals</Text>
          <Text style={styles.headerSubtitle}>Your financial targets</Text>
        </View>
        {goals.length > 0 && (
          <View style={styles.goalsSummary}>
            <Text style={styles.goalCount}>{goals.length}</Text>
            <Text style={styles.goalCountLabel}>Active</Text>
          </View>
        )}
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
          /* Goals Grid */
          <View style={styles.goalsGrid}>
            {goals.map((goal) => {
              const progress = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
              const circumference = 2 * Math.PI * 50;
              const strokeDashoffset = circumference - (progress / 100) * circumference;

              return (
                <TouchableOpacity
                  key={goal._id}
                  style={styles.goalCard}
                  onLongPress={() => {
                    Alert.alert(
                      goal.name,
                      'Choose an action',
                      [
                        {
                          text: 'Edit',
                          onPress: () => handleEditGoal(goal),
                        },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => handleDeleteGoal(goal),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    );
                  }}
                  activeOpacity={0.7}
                >
                  {/* Edit Button */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditGoal(goal)}
                  >
                    <Ionicons name="pencil" size={16} color={COLORS.primary} />
                  </TouchableOpacity>

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

                  <Text style={styles.goalName} numberOfLines={2}>{goal.name}</Text>
                  <View style={styles.goalAmounts}>
                    <Text style={styles.savedAmount}>{formatINRFull(goal.saved_amount)}</Text>
                    <Text style={styles.targetAmount}>of {formatINRFull(goal.target_amount)}</Text>
                  </View>
                  
                  {goal.deadline && (
                    <View style={styles.deadlineContainer}>
                      <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
                      <Text style={styles.deadlineText}>{goal.deadline}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Add Button */}
      {goals.length > 0 && (
        <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => {
              animateFab();
              handleAddNew();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color={COLORS.surface} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Add/Edit Goal Modal */}
      <AddGoalModal
        visible={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
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
