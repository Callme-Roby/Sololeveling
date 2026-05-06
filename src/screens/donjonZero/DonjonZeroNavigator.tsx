import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { DonjonZeroStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

const Stack = createNativeStackNavigator<DonjonZeroStackParamList>();

const Placeholder = ({ label }: { label: string }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.body}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.subtitle}>Implemente au lot 3.3</Text>
    </View>
  </SafeAreaView>
);

export const DonjonZeroNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Intro">{() => <Placeholder label="Donjon Zero" />}</Stack.Screen>
    <Stack.Screen name="BlocVIT">{() => <Placeholder label="Bloc VIT" />}</Stack.Screen>
    <Stack.Screen name="BlocAGI">{() => <Placeholder label="Bloc AGI" />}</Stack.Screen>
    <Stack.Screen name="BlocSTR">{() => <Placeholder label="Bloc STR" />}</Stack.Screen>
    <Stack.Screen name="BlocGRP">{() => <Placeholder label="Bloc GRP" />}</Stack.Screen>
    <Stack.Screen name="Sensation">{() => <Placeholder label="Sensation" />}</Stack.Screen>
    <Stack.Screen name="Complete">{() => <Placeholder label="Donjon termine" />}</Stack.Screen>
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
});
