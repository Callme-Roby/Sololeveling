import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

import { AccueilScreen } from './AccueilScreen';
import { ChevilleScreen } from './ChevilleScreen';
import { ProfilClassicScreen } from './ProfilClassicScreen';
import { RappelsScreen } from './RappelsScreen';
import { SuiviScreen } from './SuiviScreen';

export type ClassicTabParamList = {
  Accueil: undefined;
  Cheville: undefined;
  Suivi: undefined;
  Rappels: undefined;
  Profil: undefined;
};

const Tabs = createBottomTabNavigator<ClassicTabParamList>();

const icon = (focused: boolean, label: string) => (
  <Text style={[styles.icon, focused && styles.iconOn]}>{label}</Text>
);

export const MainTabsClassic = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tabs.Screen name="Accueil" component={AccueilScreen} options={{ tabBarIcon: ({ focused }) => icon(focused, 'A') }} />
    <Tabs.Screen name="Cheville" component={ChevilleScreen} options={{ tabBarIcon: ({ focused }) => icon(focused, 'C') }} />
    <Tabs.Screen name="Suivi" component={SuiviScreen} options={{ tabBarIcon: ({ focused }) => icon(focused, 'S') }} />
    <Tabs.Screen name="Rappels" component={RappelsScreen} options={{ tabBarIcon: ({ focused }) => icon(focused, 'R') }} />
    <Tabs.Screen name="Profil" component={ProfilClassicScreen} options={{ tabBarIcon: ({ focused }) => icon(focused, 'P') }} />
  </Tabs.Navigator>
);

const styles = StyleSheet.create({
  tabBar: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, height: 64, paddingBottom: 8, paddingTop: 8 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  icon: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  iconOn: { color: colors.primary },
});
