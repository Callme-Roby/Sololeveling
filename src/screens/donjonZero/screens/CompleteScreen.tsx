import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { DonjonZeroStackParamList } from '@/navigation/types';
import { titleRepo, userRepo } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'Complete'>;

export const CompleteScreen = ({ navigation }: Props) => {
  const userId = useAppStore((s) => s.user?.id);
  const setBaselinesCompleted = useAppStore((s) => s.setBaselinesCompleted);
  const [unlocking, setUnlocking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const exists = await titleRepo.hasName('Mesure');
        if (!exists) {
          await titleRepo.unlock({
            name: 'Mesure',
            source: 'milestone',
            unlockedAt: new Date().toISOString(),
          });
        }
        await userRepo.setBaselinesCompleted(userId, true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        }
      } finally {
        if (!cancelled) setUnlocking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const enterMissionPanel = () => {
    setBaselinesCompleted(true);
  };

  if (!userId) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.eyebrow}>Donjon termine</Text>
        <Text style={styles.title}>Mesure</Text>
        <View style={styles.titleCard}>
          <Text style={styles.titleCardLabel}>Titre debloque</Text>
          <Text style={styles.titleCardName}>Mesure</Text>
          <Text style={styles.titleCardSub}>
            Le hunter qui connait son point de depart
          </Text>
        </View>
        <View style={styles.bonusCard}>
          <Text style={styles.bonusLabel}>Recompense</Text>
          <Text style={styles.bonusValue}>+25 XP dans chaque stat</Text>
          <Text style={styles.bonusHint}>
            Credit applique au premier acces au Panneau de Mission.
          </Text>
        </View>
        <Text style={styles.note}>
          Tes baselines sont scellees. Toutes les comparaisons futures (donjons
          hebdo, Porte D/C, Tour Brisee) se feront contre ces chiffres.
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Ouvrir le Panneau de Mission"
          onPress={enterMissionPanel}
          loading={unlocking}
        />
        <PrimaryButton
          label="Revoir mes baselines"
          variant="ghost"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 24, gap: 16 },
  eyebrow: { color: colors.primary, fontSize: 12, letterSpacing: 2, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: colors.textPrimary, fontSize: 32, fontWeight: '800', marginTop: 4 },
  titleCard: {
    marginTop: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4,
  },
  titleCardLabel: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  titleCardName: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  titleCardSub: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  bonusCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  bonusLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  bonusValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  bonusHint: { color: colors.textMuted, fontSize: 12 },
  note: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 4 },
  error: { color: colors.danger, fontSize: 13 },
  footer: { padding: 24, paddingTop: 8, gap: 4 },
});
