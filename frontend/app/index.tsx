import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useDashboard } from '../hooks/useDashboard';
import { Header } from '../components/home/Header';
import { BankCarousel } from '../components/home/BankCarousel';
import { AddBankModal } from '../components/home/AddBankModal';
import { AgentChips } from '../components/home/AgentChips';
import { CategoryDonutChart } from '../components/home/CategoryDonutChart';
import { InsightsFeed } from '../components/home/InsightsFeed';
import { FeatureModal } from '../components/common/FeatureModal';

const FEATURE_CONTENT = {
  notifications: {
    title: 'Notifications',
    icon: 'notifications' as const,
    description: 'Stay updated with real-time alerts about your spending, bill reminders, and important financial updates. Get notified when you exceed budget limits or when payments are due.',
  },
  scan: {
    title: 'Scan Bill',
    icon: 'camera' as const,
    description: 'Quickly capture and digitize your bills by scanning them with your camera. Automatically extract payment details, due dates, and amounts for easy tracking and reminders.',
  },
  split: {
    title: 'Split Expense',
    icon: 'people' as const,
    description: 'Easily divide expenses with friends or roommates. Calculate individual shares, track who owes what, and send payment reminders to everyone involved.',
  },
  forecast: {
    title: 'Forecast Balance',
    icon: 'trending-up' as const,
    description: 'Predict your future account balance based on recurring expenses, income patterns, and spending habits. Plan ahead and avoid overdrafts with AI-powered forecasting.',
  },
  audit: {
    title: 'Subscription Audit',
    icon: 'search' as const,
    description: 'Discover all your active subscriptions and recurring payments in one place. Identify unused subscriptions, track renewal dates, and potentially save hundreds every month.',
  },
};

export default function HomeScreen() {
  const {
    user,
    accounts,
    insights,
    categoryBreakdown,
    loading,
    error,
    refreshDashboard,
  } = useDashboard();
  
  const [showAddBankModal, setShowAddBankModal] = React.useState(false);
  const [activeFeature, setActiveFeature] = React.useState<keyof typeof FEATURE_CONTENT | null>(null);

  if (loading && !user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your money buddy...</Text>
      </View>
    );
  }

  if (error && !user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Oops! {error}</Text>
        <Text style={styles.errorSubtext}>Please try again</Text>
      </View>
    );
  }

  const primaryAccount = accounts[0];
  const spendPercentage = 65; // Mock calculation for now

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshDashboard}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        {user && (
          <Header
            userName={user.name}
            spendPercentage={spendPercentage}
            onNotificationPress={() => setActiveFeature('notifications')}
          />
        )}

        {/* Bank Carousel */}
        {accounts && accounts.length > 0 && (
          <BankCarousel 
            accounts={accounts} 
            onAddBank={() => setShowAddBankModal(true)}
          />
        )}

        {/* Quick Actions / Agent Chips */}
        <AgentChips 
          onChipPress={(chipId) => {
            if (chipId === 'scan') setActiveFeature('scan');
            else if (chipId === 'split') setActiveFeature('split');
            else if (chipId === 'forecast') setActiveFeature('forecast');
            else if (chipId === 'audit') setActiveFeature('audit');
          }}
        />

        {/* Category Breakdown - Coming soon! */}
        {/* {categoryBreakdown && categoryBreakdown.length > 0 && (
          <View style={styles.section}>
            <CategoryDonutChart data={categoryBreakdown} />
          </View>
        )} */}

        {/* Insights Feed */}
        {insights && insights.length > 0 && (
          <InsightsFeed insights={insights} />
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Add Bank Modal */}
      <AddBankModal
        visible={showAddBankModal}
        onClose={() => setShowAddBankModal(false)}
        onAdd={async (bankData) => {
          try {
            await api.addBankAccount(user?._id!, bankData);
            // Refresh dashboard to show new account
            await refreshDashboard();
          } catch (error) {
            console.error('Error adding bank account:', error);
          }
        }}
      />

      {/* Feature Modal */}
      {activeFeature && (
        <FeatureModal
          visible={true}
          feature={FEATURE_CONTENT[activeFeature]}
          onClose={() => setActiveFeature(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.danger,
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  bottomPadding: {
    height: 100,
  },
});