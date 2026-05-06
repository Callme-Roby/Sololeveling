import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { OnboardingStackParamList } from '@/navigation/types';

import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Ready" component={ReadyScreen} />
  </Stack.Navigator>
);
