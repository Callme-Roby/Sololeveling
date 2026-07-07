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
import { DonjonZeroNavigator } from '@/screens/donjonZero/DonjonZeroNavigator';
import { CalisthenicsSessionScreen } from '@/screens/main/CalisthenicsSessionScreen';
import { DungeonRunScreen } from '@/screens/main/DungeonRunScreen';
import { MainTabs } from '@/screens/main/MainTabs';
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

export const RootNavigator = () => {
  const bootStatus = useAppStore((s) => s.bootStatus);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    const goWake = () => {
      if (navigationRef.isReady() && useAppStore.getState().user?.baselinesCompleted) {
        navigationRef.navigate('WakeUp');
      }
    };

    // iOS + fallback : notification expo-notifications tapee.
    const sub = Notifications.addNotificationResponseReceivedListener(goWake);

    // Android : alarme plein ecran Notifee (declenchee ou pressee).
    const unsubNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      const channel = detail.notification?.android?.channelId;
      if (channel !== ALARM_CHANNEL_ID) return;
      if (type === EventType.PRESS || type === EventType.DELIVERED) {
        goWake();
      }
    });

    // Demarrage a froid depuis l'alarme.
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
        ) : !user.baselinesCompleted ? (
          <Stack.Screen name="DonjonZero" component={DonjonZeroNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Run"
              component={RunScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="DungeonRun"
              component={DungeonRunScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="CalisthenicsSession"
              component={CalisthenicsSessionScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="WakeUp"
              component={WakeUpScreen}
              options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
