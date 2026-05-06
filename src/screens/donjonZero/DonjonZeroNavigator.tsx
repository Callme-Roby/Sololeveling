import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { DonjonZeroStackParamList } from '@/navigation/types';

import { BlocAGIScreen } from './screens/BlocAGIScreen';
import { BlocGRPScreen } from './screens/BlocGRPScreen';
import { BlocSTRScreen } from './screens/BlocSTRScreen';
import { BlocVITScreen } from './screens/BlocVITScreen';
import { CompleteScreen } from './screens/CompleteScreen';
import { IntroScreen } from './screens/IntroScreen';
import { SensationScreen } from './screens/SensationScreen';

const Stack = createNativeStackNavigator<DonjonZeroStackParamList>();

export const DonjonZeroNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Intro" component={IntroScreen} />
    <Stack.Screen name="BlocVIT" component={BlocVITScreen} />
    <Stack.Screen name="BlocAGI" component={BlocAGIScreen} />
    <Stack.Screen name="BlocSTR" component={BlocSTRScreen} />
    <Stack.Screen name="BlocGRP" component={BlocGRPScreen} />
    <Stack.Screen name="Sensation" component={SensationScreen} />
    <Stack.Screen
      name="Complete"
      component={CompleteScreen}
      options={{ gestureEnabled: false }}
    />
  </Stack.Navigator>
);
