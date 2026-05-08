import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';

import type { MainTabParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { MissionPanelScreen } from './MissionPanelScreen';
import { DonjonsScreen } from './tabs/DonjonsScreen';
import { InventaireScreen } from './tabs/InventaireScreen';
import { ProfilScreen } from './tabs/ProfilScreen';
import { StatsScreen } from './tabs/StatsScreen';

const Tabs = createBottomTabNavigator<MainTabParamList>();

const labelToIcon = (focused: boolean, label: string) => (
  <Text style={[styles.icon, focused && styles.iconFocused]}>{label}</Text>
);

export const MainTabs = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tabs.Screen
      name="Mission"
      component={MissionPanelScreen}
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'M') }}
    />
    <Tabs.Screen
      name="Stats"
      component={StatsScreen}
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'S') }}
    />
    <Tabs.Screen
      name="Donjons"
      component={DonjonsScreen}
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'D') }}
    />
    <Tabs.Screen
      name="Inventaire"
      component={InventaireScreen}
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'I') }}
    />
    <Tabs.Screen
      name="Profil"
      component={ProfilScreen}
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'P') }}
    />
  </Tabs.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  icon: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  iconFocused: { color: colors.primary },
});
