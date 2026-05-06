import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BootScreen } from '@/screens/BootScreen';
import { DonjonZeroNavigator } from '@/screens/donjonZero/DonjonZeroNavigator';
import { MainTabs } from '@/screens/main/MainTabs';
import { OnboardingNavigator } from '@/screens/onboarding/OnboardingNavigator';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

export const RootNavigator = () => {
  const bootStatus = useAppStore((s) => s.bootStatus);
  const user = useAppStore((s) => s.user);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {bootStatus !== 'ready' ? (
          <Stack.Screen name="Boot" component={BootScreen} />
        ) : !user ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : !user.baselinesCompleted ? (
          <Stack.Screen name="DonjonZero" component={DonjonZeroNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
