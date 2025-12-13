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
import { BankStack } from '../components/home/BankStack';
import { AgentChips } from '../components/home/AgentChips';
import { CategoryDonutChart } from '../components/home/CategoryDonutChart';
import { InsightsFeed } from '../components/home/InsightsFeed';

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
          />
        )}

        {/* Bank Stack */}
        {primaryAccount && (
          <BankStack account={primaryAccount} />
        )}

        {/* Agent Chips */}
        <AgentChips
          onChipPress={(chipId) => {
            console.log('Chip pressed:', chipId);
            // TODO: Implement chip actions
          }}
        />

        {/* Category Breakdown Chart */}
        {categoryBreakdown && categoryBreakdown.length > 0 && (
          <View style={styles.section}>
            <CategoryDonutChart data={categoryBreakdown} />
          </View>
        )}

        {/* Insights Feed */}
        {insights && insights.length > 0 && (
          <InsightsFeed insights={insights} />
        )}

        {/* Bottom padding */}
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
    height: SPACING.xxl,
  },
});