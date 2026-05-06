import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { OnboardingStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const Placeholder = ({ label }: { label: string }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.body}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.subtitle}>Implemente au lot 3.2</Text>
    </View>
  </SafeAreaView>
);

export const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome">{() => <Placeholder label="Bienvenue, Hunter" />}</Stack.Screen>
    <Stack.Screen name="Profile">{() => <Placeholder label="Profil" />}</Stack.Screen>
    <Stack.Screen name="Home">{() => <Placeholder label="Domicile" />}</Stack.Screen>
    <Stack.Screen name="Ready">{() => <Placeholder label="Pret" />}</Stack.Screen>
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
});
