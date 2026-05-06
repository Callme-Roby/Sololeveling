import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { gpsTrackRepo, validationRepo } from '@/services/db';
import { formatDistance, formatDuration, formatPace } from '@/services/gps';
import { computeXp } from '@/services/xp';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

import { useGpsTracker } from './hooks/useGpsTracker';
import { EXERCISES_BY_ID } from '@/data/exercises';

type Props = NativeStackScreenProps<RootStackParamList, 'Run'>;

export const RunScreen = ({ navigation, route }: Props) => {
  const exerciseId = route.params?.exerciseId ?? 'footing_z2';
  const workoutId = route.params?.workoutId;
  const user = useAppStore((s) => s.user);
  const { state, error, stats, start, stop, reset } = useGpsTracker();
  const [saving, setSaving] = useState(false);

  const exercise = EXERCISES_BY_ID[exerciseId];

  const handleSave = async () => {
    if (!user || !exercise) return;
    setSaving(true);
    try {
      const startedAt =
        stats.durationSeconds > 0
          ? new Date(Date.now() - stats.durationSeconds * 1000).toISOString()
          : new Date().toISOString();
      const endedAt = new Date().toISOString();
      await gpsTrackRepo.insert({
        startedAt,
        endedAt,
        distanceMeters: stats.distanceMeters,
        durationSeconds: stats.durationSeconds,
        averagePaceSecPerKm: stats.averagePaceSecPerKm,
        maxSpeedMps: stats.maxSpeedMps,
        elevationGainMeters: stats.elevationGainMeters,
        points: [],
        workoutId,
      });
      const value =
        exercise.unit === 'minutes'
          ? Math.max(1, Math.round(stats.durationSeconds / 60))
          : exercise.unit === 'meters'
            ? stats.distanceMeters
            : Math.max(1, Math.round(stats.durationSeconds / 60));
      const xpEarned = computeXp({
        exercise,
        value,
        loadKg: 0,
        bodyWeightKg: user.bodyWeightKg,
        streakDays: user.streakDays,
      });
      await validationRepo.insert({
        exerciseId: exercise.id,
        workoutId,
        date: new Date().toISOString().slice(0, 10),
        value,
        unit: exercise.unit,
        loadKg: 0,
        xpEarned,
        isPersonalRecord: false,
        notes: `GPS: ${formatDistance(stats.distanceMeters)} en ${formatDuration(stats.durationSeconds)}`,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Sauvegarde impossible',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Tracking GPS</Text>
          <Text style={styles.title}>{exercise?.name ?? 'Course'}</Text>
        </View>

        <View style={styles.statsBlock}>
          <Stat value={formatDistance(stats.distanceMeters)} label="Distance" />
          <Stat value={formatDuration(stats.durationSeconds)} label="Duree" />
          <Stat
            value={formatPace(stats.averagePaceSecPerKm)}
            label="Allure / km"
          />
          <Stat
            value={`${stats.maxSpeedMps.toFixed(1)} m/s`}
            label="Vitesse max"
          />
          <Stat
            value={`${stats.elevationGainMeters} m`}
            label="Denivele +"
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.actions}>
          {state === 'idle' || state === 'error' ? (
            <PrimaryButton label="Demarrer le tracking" onPress={start} />
          ) : state === 'requesting' ? (
            <PrimaryButton label="Acquisition GPS..." onPress={() => {}} loading />
          ) : state === 'tracking' ? (
            <PrimaryButton label="Arreter" variant="secondary" onPress={stop} />
          ) : (
            <>
              <PrimaryButton
                label="Enregistrer la seance"
                onPress={handleSave}
                loading={saving}
              />
              <PrimaryButton
                label="Recommencer"
                variant="ghost"
                onPress={reset}
              />
            </>
          )}
          <PrimaryButton
            label="Quitter sans sauvegarder"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statRow}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 24, gap: 20 },
  header: { gap: 4 },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800' },
  statsBlock: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: { color: colors.textMuted, fontSize: 13 },
  error: { color: colors.danger, fontSize: 13 },
  actions: { gap: 8 },
});
