import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { userRepo } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Ready'>;

export const ReadyScreen = ({ route }: Props) => {
  const { name, bodyWeightKg, homeLat, homeLng, homeRadiusKm } = route.params;
  const setUser = useAppStore((s) => s.setUser);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const user = await userRepo.create({
        name,
        bodyWeightKg,
        homeLat,
        homeLng,
        homeRadiusKm,
        rank: 'E',
        streakDays: 0,
        startDate: new Date().toISOString(),
        baselinesCompleted: false,
        freeInvocationsUsedByPhase: { 1: 0, 2: 0, 3: 0 },
        notificationsEnabled: false,
        weatherEnabled: false,
        backgroundLocationEnabled: false,
        mustRedoFromWeek: null,
      });
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text style={styles.step}>Etape 3 / 3</Text>
          <Text style={styles.title}>Recapitulatif</Text>
        </View>
        <View style={styles.card}>
          <Row label="Hunter" value={name} />
          <Row label="Poids" value={`${bodyWeightKg} kg`} />
          <Row label="Domicile" value={`${homeLat.toFixed(4)}, ${homeLng.toFixed(4)}`} />
          <Row label="Rayon" value={`${homeRadiusKm} km`} />
          <Row label="Rang initial" value="E" />
        </View>
        <Text style={styles.note}>
          Le Donjon Zero arrive ensuite : 11 baselines a mesurer (~75 min, scindable
          sur 2 jours). Aucune semaine ne s'ouvre tant qu'il n'est pas termine.
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Acceder au Donjon Zero"
          onPress={create}
          loading={submitting}
        />
      </View>
    </SafeAreaView>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 24, gap: 16 },
  header: { gap: 6, marginBottom: 8 },
  step: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  note: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  error: { color: colors.danger, fontSize: 13 },
  footer: { padding: 24, paddingTop: 8 },
});
