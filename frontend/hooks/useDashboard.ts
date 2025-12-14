import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';

export const useDashboard = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user: authUser } = useAuth();
  const {
    user,
    accounts,
    insights,
    categoryBreakdown,
    spendVelocity,
    loading,
    error,
    setUser,
    setAccounts,
    setInsights,
    setCategoryBreakdown,
    setSpendVelocity,
    setLoading,
    setError,
  } = useAppStore();

  const initializeApp = async () => {
    if (!authUser) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard data using authenticated user's ID
      const dashboardData = await api.getDashboard(authUser._id);
      
      setUser(dashboardData.user);
      setAccounts(dashboardData.accounts);
      setInsights(dashboardData.insights);
      setCategoryBreakdown(dashboardData.category_breakdown);
      setSpendVelocity(dashboardData.spend_velocity);
      
      setIsInitialized(true);
    } catch (err: any) {
      console.error('Dashboard initialization error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const dashboardData = await api.getDashboard(user._id);
      
      setAccounts(dashboardData.accounts);
      setInsights(dashboardData.insights);
      setCategoryBreakdown(dashboardData.category_breakdown);
      setSpendVelocity(dashboardData.spend_velocity);
    } catch (err: any) {
      console.error('Dashboard refresh error:', err);
      setError(err.message || 'Failed to refresh dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, []);

  return {
    user,
    accounts,
    insights,
    categoryBreakdown,
    spendVelocity,
    loading,
    error,
    refreshDashboard,
  };
};