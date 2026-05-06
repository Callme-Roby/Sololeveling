import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { MainTabParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { MissionPanelScreen } from './MissionPanelScreen';

const Tabs = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen = ({ label, hint }: { label: string; hint: string }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.body}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.subtitle}>{hint}</Text>
    </View>
  </SafeAreaView>
);

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
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'S') }}
    >
      {() => <PlaceholderScreen label="Stats" hint="Lot 6" />}
    </Tabs.Screen>
    <Tabs.Screen
      name="Donjons"
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'D') }}
    >
      {() => <PlaceholderScreen label="Donjons" hint="Lot 8" />}
    </Tabs.Screen>
    <Tabs.Screen
      name="Inventaire"
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'I') }}
    >
      {() => <PlaceholderScreen label="Inventaire" hint="Phase 2" />}
    </Tabs.Screen>
    <Tabs.Screen
      name="Profil"
      options={{ tabBarIcon: ({ focused }) => labelToIcon(focused, 'P') }}
    >
      {() => <PlaceholderScreen label="Profil" hint="Lot 4" />}
    </Tabs.Screen>
  </Tabs.Navigator>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
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
