import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { OnboardingStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Profile'>;

export const ProfileScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');

  const weightNum = useMemo(() => {
    const v = Number(weight.replace(',', '.'));
    return Number.isFinite(v) ? v : NaN;
  }, [weight]);

  const nameError =
    name.trim().length > 0 && name.trim().length < 2
      ? 'Au moins 2 caracteres'
      : undefined;

  const weightError =
    weight.length > 0 && (Number.isNaN(weightNum) || weightNum < 30 || weightNum > 200)
      ? 'Entre 30 et 200 kg'
      : undefined;

  const canContinue =
    name.trim().length >= 2 &&
    !Number.isNaN(weightNum) &&
    weightNum >= 30 &&
    weightNum <= 200;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.step}>Etape 1 / 3</Text>
            <Text style={styles.title}>Ton profil</Text>
            <Text style={styles.subtitle}>
              Le poids corporel sert a calculer l'XP des exercices lestes.
            </Text>
          </View>
          <TextField
            label="Nom de Hunter"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Roby"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={32}
            error={nameError}
          />
          <TextField
            label="Poids corporel (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="70"
            keyboardType="decimal-pad"
            maxLength={5}
            error={weightError}
            hint="Approximatif, ajustable plus tard"
          />
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            label="Continuer"
            disabled={!canContinue}
            onPress={() =>
              navigation.navigate('Home', {
                name: name.trim(),
                bodyWeightKg: weightNum,
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  body: { padding: 24, paddingBottom: 12, gap: 8 },
  header: { gap: 6, marginBottom: 12 },
  step: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  footer: { padding: 24, paddingTop: 8 },
});
