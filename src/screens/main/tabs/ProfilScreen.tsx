import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { resetDatabase } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

import { AlarmCard } from '../components/AlarmCard';

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const ProfilScreen = () => {
  const user = useAppStore((s) => s.user);
  const [resetting, setResetting] = useState(false);

  if (!user) return null;

  const startedDays = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  const promptReset = () => {
    Alert.alert(
      'Reinitialiser l\'application',
      'Cette action efface profil, baselines, validations, donjons et titres. Action irreversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            try {
              await resetDatabase();
              useAppStore.setState({
                bootStatus: 'pending',
                bootError: null,
                user: null,
                currentWeek: 1,
              });
            } catch (err) {
              Alert.alert('Erreur', err instanceof Error ? err.message : 'Echec du reset');
              setResetting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Profil</Text>

        <AlarmCard />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hunter</Text>
          <Row label="Nom" value={user.name} />
          <Row label="Poids" value={`${user.bodyWeightKg} kg`} />
          <Row label="Rang" value={user.rank} />
          <Row label="Streak" value={`${user.streakDays} jour${user.streakDays > 1 ? 's' : ''}`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Programme</Text>
          <Row label="Demarre le" value={user.startDate.slice(0, 10)} />
          <Row label="Jour" value={`J${startedDays + 1}`} />
          <Row
            label="Baselines"
            value={user.baselinesCompleted ? 'Completees' : 'En attente'}
          />
          {user.mustRedoFromWeek !== null && (
            <Row label="Redo week" value={`Semaine ${user.mustRedoFromWeek}`} />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Domicile</Text>
          <Row
            label="Position"
            value={`${user.homeLat.toFixed(4)}, ${user.homeLng.toFixed(4)}`}
          />
          <Row label="Rayon" value={`${user.homeRadiusKm} km`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <Row
            label="Notifications"
            value={user.notificationsEnabled ? 'Activees' : 'Desactivees'}
          />
          <Row
            label="Meteo"
            value={user.weatherEnabled ? 'Activee' : 'Desactivee'}
          />
          <Row
            label="GPS background"
            value={user.backgroundLocationEnabled ? 'Active' : 'Desactive'}
          />
        </View>

        <View style={[styles.card, styles.dangerCard]}>
          <Text style={styles.dangerTitle}>Zone dangereuse</Text>
          <Text style={styles.dangerHint}>
            Pratique pour iterer pendant le developpement. Tu repasses par
            l'onboarding apres reset.
          </Text>
          <PrimaryButton
            label="Reinitialiser l'application"
            variant="secondary"
            onPress={promptReset}
            loading={resetting}
            style={styles.dangerBtn}
          />
        </View>

        <Text style={styles.footnote}>
          Sololeveling preview · build local Gradle · stockage SQLite local.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginVertical: 8 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  dangerCard: { borderColor: colors.danger },
  dangerTitle: { color: colors.danger, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  dangerHint: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  dangerBtn: { marginTop: 4 },
  footnote: {
    color: colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});
