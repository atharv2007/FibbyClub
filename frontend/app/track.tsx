import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { api } from '../utils/api';
import { MonthlyBarChart } from '../components/track/MonthlyBarChart';
import { CategoryList } from '../components/track/CategoryList';
import { MerchantLeaderboard } from '../components/track/MerchantLeaderboard';

type TabType = 'spend' | 'income' | 'networth';

export default function TrackScreen() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('spend');
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Initialize user if not exists
  useEffect(() => {
    const initUser = async () => {
      if (!user) {
        try {
          const initResult = await api.initializeUser();
          if (initResult.user_id) {
            const dashboardData = await api.getDashboard(initResult.user_id);
            setUser(dashboardData.user);
          }
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      }
    };
    
    initUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, activeTab]);

  const loadData = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      
      if (activeTab === 'spend') {
        const [monthly, categoryData, merchantData] = await Promise.all([
          api.getMonthlySpending(user._id),
          api.getCategoryBreakdown(user._id, 1),
          api.getMerchantLeaderboard(user._id, 10),
        ]);
        
        setMonthlyData(monthly);
        setCategories(categoryData);
        setMerchants(merchantData);
        
        if (monthly.length > 0 && !selectedMonth) {
          setSelectedMonth(monthly[monthly.length - 1].month);
        }
      } else if (activeTab === 'income') {
        const monthly = await api.getMonthlyIncome(user._id);
        setMonthlyData(monthly);
      }
    } catch (error) {
      console.error('Error loading track data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'spend' && styles.activeTab]}
          onPress={() => setActiveTab('spend')}
        >
          <Text style={[styles.tabText, activeTab === 'spend' && styles.activeTabText]}>
            Spend Analysis
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'income' && styles.activeTab]}
          onPress={() => setActiveTab('income')}
        >
          <Text style={[styles.tabText, activeTab === 'income' && styles.activeTabText]}>
            Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'networth' && styles.activeTab]}
          onPress={() => setActiveTab('networth')}
        >
          <Text style={[styles.tabText, activeTab === 'networth' && styles.activeTabText]}>
            Net Worth
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'spend' && (
            <>
              {/* Monthly Bar Chart */}
              {monthlyData.length > 0 && (
                <MonthlyBarChart
                  data={monthlyData}
                  onMonthSelect={(month) => setSelectedMonth(month)}
                />
              )}

              {/* Category List */}
              {categories.length > 0 && (
                <CategoryList categories={categories} merchants={merchants} />
              )}

              {/* Merchant Leaderboard */}
              {merchants.length > 0 && (
                <MerchantLeaderboard 
                  merchants={merchants}
                  onMerchantPress={(merchantId) => {
                    console.log('Merchant pressed:', merchantId);
                    // TODO: Navigate to merchant details
                  }}
                />
              )}
            </>
          )}

          {activeTab === 'income' && (
            <>
              {monthlyData.length > 0 && (
                <MonthlyBarChart
                  data={monthlyData}
                  onMonthSelect={(month) => setSelectedMonth(month)}
                />
              )}
              
              <View style={styles.comingSoon}>
                <Ionicons name="cash-outline" size={48} color={COLORS.textTertiary} />
                <Text style={styles.comingSoonText}>Income breakdown coming soon!</Text>
              </View>
            </>
          )}

          {activeTab === 'networth' && (
            <View style={styles.comingSoon}>
              <Ionicons name="trending-up-outline" size={48} color={COLORS.textTertiary} />
              <Text style={styles.comingSoonText}>Net worth tracking coming soon!</Text>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  comingSoonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});