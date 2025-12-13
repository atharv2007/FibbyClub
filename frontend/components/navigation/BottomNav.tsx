import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

type TabRoute = '/' | '/track' | '/chat' | '/goals' | '/profile';

interface Tab {
  route: TabRoute;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  label: string;
  isCenter?: boolean;
}

const TABS: Tab[] = [
  {
    route: '/',
    icon: 'home',
    iconOutline: 'home-outline',
    label: 'Home',
  },
  {
    route: '/track',
    icon: 'analytics',
    iconOutline: 'analytics-outline',
    label: 'Track',
  },
  {
    route: '/chat',
    icon: 'chatbubble-ellipses',
    iconOutline: 'chatbubble-ellipses-outline',
    label: 'Fibby',
    isCenter: true,
  },
  {
    route: '/goals',
    icon: 'trophy',
    iconOutline: 'trophy-outline',
    label: 'Goals',
  },
  {
    route: '/profile',
    icon: 'person',
    iconOutline: 'person-outline',
    label: 'Me',
  },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (route: TabRoute) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {TABS.map((tab, index) => {
          const isActive = pathname === tab.route;
          const iconName = isActive ? tab.icon : tab.iconOutline;

          if (tab.isCenter) {
            // Special center CHAT button
            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.centerTabWrapper}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.centerTab, isActive && styles.centerTabActive]}>
                  <Ionicons
                    name={iconName}
                    size={28}
                    color={isActive ? COLORS.surface : COLORS.primary}
                  />
                </View>
                <Text style={[styles.centerLabel, isActive && styles.centerLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          // Regular tabs
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isActive ? COLORS.primary : COLORS.textTertiary}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    minHeight: 48,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textTertiary,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Center CHAT tab styles
  centerTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 4,
    marginTop: -20,
  },
  centerTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    borderWidth: 3,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  centerLabelActive: {
    color: COLORS.primary,
  },
});
