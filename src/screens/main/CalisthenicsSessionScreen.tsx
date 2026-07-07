import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { getPattern, type MovementPattern } from '@/data/calisthenics/catalog';
import type { CalMission, MissionItem } from '@/data/calisthenics/progression';
import type { RootStackParamList } from '@/navigation/types';
import { completeCalSession, getCalMission } from '@/services/calisthenics';
import { validationRepo } from '@/services/db';
import { colors } from '@/theme/colors';
import { dayOfWeekIso } from '@/utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'CalisthenicsSession'>;

interface ItemState {
  achieved: string;
  done: boolean;
}

export const CalisthenicsSessionScreen = ({ navigation }: Props) => {
  const [mission, setMission] = useState<CalMission | null>(null);
  const [items, setItems] = useState<Record<string, ItemState>>({});
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCalMission().then(({ mission: m }) => {
      if (cancelled) return;
      setMission(m);
      const init: Record<string, ItemState> = {};
      for (const it of m.items) {
        init[it.pattern] = { achieved: String(it.target), done: false };
      }
      setItems(init);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const mainPatterns = useMemo(
    () => mission?.items.filter((i) => i.pattern !== 'warmup') ?? [],
    [mission],
  );

  const doneCount = mainPatterns.filter((i) => items[i.pattern]?.done).length;
  const canClose = doneCount > 0;

  if (!mission) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Chargement de la seance...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const toggleDone = (item: MissionItem) => {
    setItems((prev) => {
      const curr = prev[item.pattern] ?? { achieved: String(item.target), done: false };
      return { ...prev, [item.pattern]: { ...curr, done: !curr.done } };
    });
  };

  const setAchieved = (pattern: MovementPattern, v: string) => {
    setItems((prev) => ({
      ...prev,
      [pattern]: { ...(prev[pattern] ?? { achieved: '', done: false }), achieved: v },
    }));
  };

  const closeSession = async () => {
    setClosing(true);
    try {
      const today = dayOfWeekIso();
      const completed: MovementPattern[] = [];
      for (const item of mission.items) {
        const st = items[item.pattern];
        if (!st?.done) continue;
        const achieved = Number(st.achieved.replace(',', '.'));
        const value = Number.isFinite(achieved) && achieved > 0 ? achieved : item.target;
        const def = getPattern(item.pattern);
        const xp = Math.round(def.baseXpPerUnit * value * item.sets * 10) / 10;
        await validationRepo.insert({
          exerciseId: item.exerciseId,
          date: today,
          value,
          unit: item.unit,
          loadKg: 0,
          xpEarned: xp,
          isPersonalRecord: false,
          notes: `Calisthenie ${item.patternLabel} ${item.sets}x${value}`,
        });
        // Only progress a pattern if the achieved value met the target.
        if (value >= item.target) completed.push(item.pattern);
      }
      await completeCalSession(completed, today);
      Alert.alert(
        'Seance cloturee',
        completed.length > 0
          ? `Progression appliquee sur ${completed.length} mouvement(s). Demain, le Systeme monte la barre d'un cran.`
          : 'Seance enregistree. Vise les cibles pour progresser.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Sauvegarde impossible');
    } finally {
      setClosing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Street Workout</Text>
          <Text style={styles.title}>{mission.dayLabel}</Text>
          <Text style={styles.subtitle}>{mission.focus}</Text>
          <Text style={styles.progress}>{`${doneCount}/${mainPatterns.length} mouvements valides`}</Text>
        </View>

        {mission.items.map((item) => {
          const st = items[item.pattern];
          const done = st?.done ?? false;
          return (
            <View key={item.pattern} style={[styles.card, done && styles.cardDone]}>
              <View style={styles.cardTop}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exName}>{item.name}</Text>
                  <Text style={styles.exScheme}>
                    {`${item.sets} series x ${item.target} ${item.unit === 'seconds' ? 'sec' : 'reps'}`}
                    {item.isLastLevel ? '  ·  palier max' : ''}
                  </Text>
                </View>
              </View>
              <Text style={styles.instructions}>{item.instructions}</Text>
              <View style={styles.actionRow}>
                <View style={styles.achievedBox}>
                  <Text style={styles.achievedLabel}>Realise / serie</Text>
                  <TextInput
                    style={styles.achievedInput}
                    value={st?.achieved ?? ''}
                    onChangeText={(v) => setAchieved(item.pattern, v)}
                    keyboardType="number-pad"
                    placeholder={String(item.target)}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <Pressable
                  style={[styles.doneBtn, done && styles.doneBtnActive]}
                  onPress={() => toggleDone(item)}
                >
                  <Text style={[styles.doneText, done && styles.doneTextActive]}>
                    {done ? 'Valide ✓' : 'Valider'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Cloturer la seance"
          onPress={closeSession}
          disabled={!canClose}
          loading={closing}
        />
        <PrimaryButton label="Quitter" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.textMuted, fontSize: 14 },
  body: { padding: 16, gap: 12 },
  header: { gap: 4, marginBottom: 4 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
  progress: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  cardDone: { borderColor: colors.success },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  emoji: { fontSize: 26 },
  exName: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  exScheme: { color: colors.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  instructions: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  achievedBox: { flex: 1, gap: 4 },
  achievedLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  achievedInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 16,
  },
  doneBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  doneBtnActive: { backgroundColor: colors.success, borderColor: colors.success },
  doneText: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
  doneTextActive: { color: colors.background },
  footer: { padding: 16, paddingTop: 8, gap: 4 },
});
