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
import { BudgetCard } from '../components/track/BudgetCard';
import { CategoryLimits } from '../components/track/CategoryLimits';
import { CreditCard } from '../components/track/CreditCard';

type TabType = 'budget' | 'spend' | 'credit';

export default function TrackScreen() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthNum, setSelectedMonthNum] = useState<number | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [timePeriod, setTimePeriod] = useState('6mnth');

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
        // Load monthly data
        const monthly = await api.getMonthlySpending(user._id, 6);
        setMonthlyData(monthly);
        
        // If no month selected, use the latest
        if (monthly.length > 0 && !selectedMonth) {
          const latestMonth = monthly[monthly.length - 1];
          setSelectedMonth(latestMonth.month);
          setSelectedMonthNum(latestMonth.month_num);
          setSelectedYear(latestMonth.year);
        }
        
        // Load category and merchant data based on selected month
        await loadFilteredData(selectedMonthNum, selectedYear);
      }
    } catch (error) {
      console.error('Error loading track data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadFilteredData = async (monthNum?: number, year?: number) => {
    if (!user?._id) return;
    
    try {
      let categoryData, merchantData;
      
      if (monthNum && year) {
        // Filter by specific month
        const categoryUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/transactions/category-breakdown?user_id=${user._id}&month=${monthNum}&year=${year}`;
        const merchantUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/transactions/merchant-leaderboard?user_id=${user._id}&limit=10&month=${monthNum}&year=${year}`;
        
        const [catResponse, merchResponse] = await Promise.all([
          fetch(categoryUrl),
          fetch(merchantUrl),
        ]);
        
        categoryData = await catResponse.json();
        merchantData = await merchResponse.json();
      } else {
        // Default - last 30 days
        categoryData = await api.getCategoryBreakdown(user._id, 1);
        merchantData = await api.getMerchantLeaderboard(user._id, 10);
      }
      
      setCategories(categoryData);
      setMerchants(merchantData);
    } catch (error) {
      console.error('Error loading filtered data:', error);
    }
  };

  const handleMonthSelect = async (month: string, monthNum?: number, year?: number) => {
    setSelectedMonth(month);
    setSelectedMonthNum(monthNum);
    setSelectedYear(year);
    
    // Load filtered data for the selected month
    await loadFilteredData(monthNum, year);
  };

  const handlePeriodChange = (period: string) => {
    setTimePeriod(period);
    console.log('Period changed to:', period);
    // TODO: Implement different time period data loading (1wk, 1mnth, 1yr)
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
          style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
          onPress={() => setActiveTab('budget')}
        >
          <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
            Budget
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'spend' && styles.activeTab]}
          onPress={() => setActiveTab('spend')}
        >
          <Text style={[styles.tabText, activeTab === 'spend' && styles.activeTabText]}>
            Spending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'credit' && styles.activeTab]}
          onPress={() => setActiveTab('credit')}
        >
          <Text style={[styles.tabText, activeTab === 'credit' && styles.activeTabText]}>
            Credit
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'budget' && (
            <>
              {/* Budget Card */}
              <BudgetCard budget={45000} spent={31200} />

              {/* Category Limits */}
              <CategoryLimits
                categories={[
                  { name: 'Food', spent: 8500, limit: 12000, color: '#F43F5E' },
                  { name: 'Shopping', spent: 4200, limit: 5000, color: '#3B82F6' },
                  { name: 'Transport', spent: 3100, limit: 6000, color: '#10B981' },
                  { name: 'Entertainment', spent: 2400, limit: 3000, color: '#8B5CF6' },
                ]}
              />

              {/* Monthly Bar Chart Toggle */}
              {monthlyData.length > 0 && (
                <MonthlyBarChart
                  data={monthlyData}
                  onMonthSelect={(month) => setSelectedMonth(month)}
                />
              )}
            </>
          )}

          {activeTab === 'spend' && (
            <>
              {/* Monthly Bar Chart with Filtering */}
              {monthlyData.length > 0 && (
                <MonthlyBarChart
                  data={monthlyData}
                  onMonthSelect={handleMonthSelect}
                  onPeriodChange={handlePeriodChange}
                  selectedPeriod={timePeriod}
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
                  }}
                />
              )}
            </>
          )}

          {activeTab === 'credit' && (
            <CreditCard
              creditInfo={{
                score: 785,
                totalLimit: 300000,
                availableCredit: 238000,
                currentSpend: 62000,
                points: 12450,
              }}
            />
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