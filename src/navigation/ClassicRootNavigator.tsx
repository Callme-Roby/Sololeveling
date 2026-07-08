import {
  NavigationContainer,
  DarkTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import notifee, { EventType } from '@notifee/react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { ALARM_CHANNEL_ID } from '@/services/alarm';
import { BootScreen } from '@/screens/BootScreen';
import { AnkleSessionScreen } from '@/screens/classic/AnkleSessionScreen';
import { MainTabsClassic } from '@/screens/classic/MainTabsClassic';
import { CalisthenicsSessionScreen } from '@/screens/main/CalisthenicsSessionScreen';
import { RunScreen } from '@/screens/main/RunScreen';
import { WakeUpScreen } from '@/screens/main/WakeUpScreen';
import { OnboardingNavigator } from '@/screens/onboarding/OnboardingNavigator';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

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

export const ClassicRootNavigator = () => {
  const bootStatus = useAppStore((s) => s.bootStatus);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    const goWake = () => {
      if (navigationRef.isReady() && useAppStore.getState().user) {
        navigationRef.navigate('WakeUp');
      }
    };
    const sub = Notifications.addNotificationResponseReceivedListener(goWake);
    const unsubNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (detail.notification?.android?.channelId !== ALARM_CHANNEL_ID) return;
      if (type === EventType.PRESS || type === EventType.DELIVERED) goWake();
    });
    notifee
      .getInitialNotification()
      .then((initial) => {
        if (initial?.notification?.android?.channelId === ALARM_CHANNEL_ID) {
          setTimeout(goWake, 400);
        }
      })
      .catch(() => {});
    return () => {
      sub.remove();
      unsubNotifee();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {bootStatus !== 'ready' ? (
          <Stack.Screen name="Boot" component={BootScreen} />
        ) : !user ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabsClassic} />
            <Stack.Screen name="CalisthenicsSession" component={CalisthenicsSessionScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="AnkleSession" component={AnkleSessionScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Run" component={RunScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="WakeUp" component={WakeUpScreen} options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
