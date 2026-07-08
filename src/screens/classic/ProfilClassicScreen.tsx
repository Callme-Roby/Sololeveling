import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { resetDatabase } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const ProfilClassicScreen = () => {
  const user = useAppStore((s) => s.user);
  const [resetting, setResetting] = useState(false);

  if (!user) return null;

  const startedDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24)),
  );

  const promptReset = () => {
    Alert.alert(
      'Reinitialiser',
      'Efface profil, seances, suivi et rappels. Irreversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            setResetting(true);
            try {
              await resetDatabase();
              useAppStore.setState({ bootStatus: 'pending', bootError: null, user: null, currentWeek: 1 });
            } catch (err) {
              Alert.alert('Erreur', err instanceof Error ? err.message : 'Echec');
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

        <View style={styles.card}>
          <Row label="Nom" value={user.name} />
          <Row label="Poids" value={`${user.bodyWeightKg} kg`} />
          <Row label="Demarre le" value={user.startDate.slice(0, 10)} />
          <Row label="Jour" value={`J${startedDays + 1}`} />
          <Row label="Serie" value={`${user.streakDays} jour(s)`} />
        </View>

        <View style={[styles.card, styles.danger]}>
          <Text style={styles.dangerTitle}>Zone dangereuse</Text>
          <PrimaryButton
            label="Reinitialiser l'application"
            variant="secondary"
            onPress={promptReset}
            loading={resetting}
          />
        </View>

        <Text style={styles.footnote}>Version classique · programmes + suivi + rappels.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 8 },
  card: { backgroundColor: colors.surfaceAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  danger: { borderColor: colors.danger },
  dangerTitle: { color: colors.danger, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  footnote: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic', textAlign: 'center', marginTop: 8 },
});
