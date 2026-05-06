import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { getWeeklyDungeon } from '@/data/weeklyDungeons';
import type { DungeonAttempt, WeeklyDungeon } from '@/domain/types';
import type { RootStackParamList as Stack } from '@/navigation/types';
import { dungeonAttemptRepo, titleRepo, userRepo } from '@/services/db';
import { scoreDungeon } from '@/services/dungeonScoring';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

import { useWeekDiscipline } from './hooks/useWeekDiscipline';

type Props = NativeStackScreenProps<Stack, 'DungeonRun'>;

const Star = ({ filled }: { filled: boolean }) => (
  <Text style={[styles.star, filled && styles.starFilled]}>{'★'}</Text>
);

const MarkerInput = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) => (
  <TextField
    label={label}
    value={value}
    onChangeText={onChange}
    placeholder="0"
    keyboardType="decimal-pad"
    hint={hint}
  />
);

export const DungeonRunScreen = ({ navigation, route }: Props) => {
  const { weekNumber } = route.params;
  const dungeon = useMemo(
    () => getWeeklyDungeon(weekNumber),
    [weekNumber],
  ) as WeeklyDungeon | undefined;
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const discipline = useWeekDiscipline();

  const [values, setValues] = useState<Record<string, string>>({});
  const [previous, setPrevious] = useState<DungeonAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!dungeon) return;
    let cancelled = false;
    (async () => {
      const last = await dungeonAttemptRepo.getLatestForDungeon(dungeon.id);
      if (!cancelled) setPrevious(last);
    })();
    return () => {
      cancelled = true;
    };
  }, [dungeon]);

  if (!dungeon || !user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Donjon introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const numericValues: Record<string, number> = {};
  for (const m of dungeon.protocol) {
    const raw = values[m.id]?.replace(',', '.') ?? '';
    const n = Number(raw);
    if (Number.isFinite(n)) numericValues[m.id] = n;
  }

  const score = scoreDungeon({
    dungeon,
    markerValues: numericValues,
    previousAttempt: previous,
    streakDays: user.streakDays,
    weekQuestsCompletedCount: discipline.questsCompletedCount,
    totalQuestsThisWeek: discipline.totalQuestsThisWeek,
  });

  const allFilled = dungeon.protocol.every(
    (m) => (numericValues[m.id] ?? 0) > 0,
  );

  const submit = async () => {
    setSubmitting(true);
    try {
      const completed = allFilled;
      await dungeonAttemptRepo.insert({
        dungeonId: dungeon.id,
        date: new Date().toISOString().slice(0, 10),
        markerValues: numericValues,
        starsAchieved: completed ? score.stars : 0,
        completed,
      });
      let rankAwarded: typeof user.rank | null = null;
      let redoSet: number | null = null;
      if (completed && score.stars >= 1) {
        await titleRepo.unlock({
          name: dungeon.titleOnSuccess,
          source: dungeon.kind === 'porte' ? 'porte_dungeon' : 'weekly_dungeon',
          unlockedAt: new Date().toISOString(),
          dungeonId: dungeon.id,
        });
        if (dungeon.kind === 'porte' && dungeon.rankAwarded) {
          await userRepo.setRank(user.id, dungeon.rankAwarded);
          rankAwarded = dungeon.rankAwarded;
          if (user.mustRedoFromWeek !== null) {
            await userRepo.setMustRedoFromWeek(user.id, null);
          }
          setUser({
            ...user,
            rank: dungeon.rankAwarded,
            mustRedoFromWeek: null,
          });
        }
      } else if (dungeon.kind === 'porte' && !completed) {
        await userRepo.setMustRedoFromWeek(user.id, dungeon.weekNumber);
        redoSet = dungeon.weekNumber;
        setUser({ ...user, mustRedoFromWeek: dungeon.weekNumber });
      }
      Alert.alert(
        completed
          ? rankAwarded
            ? `Rang ${rankAwarded} atteint`
            : `${score.stars} etoile${score.stars > 1 ? 's' : ''}`
          : 'Donjon abandonne',
        completed
          ? `Titre ${dungeon.titleOnSuccess} ${score.stars >= 1 ? 'debloque' : 'pas debloque'}`
          : redoSet
            ? `Tu refais la semaine ${redoSet} avant de monter de rang.`
            : 'Aucune progression enregistree',
      );
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Sauvegarde impossible',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{`Donjon - Semaine ${dungeon.weekNumber}`}</Text>
            <Text style={styles.title}>{`${dungeon.emoji} ${dungeon.name}`}</Text>
            {dungeon.narrative && (
              <Text style={styles.narrative}>{dungeon.narrative}</Text>
            )}
          </View>

          <View style={styles.starsBlock}>
            {[1, 2, 3].map((n) => (
              <Star key={n} filled={score.stars >= n} />
            ))}
          </View>

          <View style={styles.scoreCard}>
            <ScoreRow label="Marqueurs ameliores" value={`${score.improvedMarkers} / ${score.totalMarkers}`} />
            <ScoreRow label="Discipline semaine" value={`${Math.round(score.discipline * 100)}%`} />
            <ScoreRow label="Streak" value={`${user.streakDays}j (${Math.round(score.streakBonus * 100)}%)`} />
            <ScoreRow label="Score final" value={`${(score.final * 100).toFixed(0)}%`} />
          </View>

          <Text style={styles.sectionTitle}>Marqueurs</Text>
          {dungeon.protocol.map((m) => {
            const prev = previous?.markerValues[m.id];
            const hint = prev !== undefined ? `Precedent: ${prev}` : 'Pas de precedent';
            return (
              <MarkerInput
                key={m.id}
                label={`${m.label} (${m.unit})`}
                value={values[m.id] ?? ''}
                onChange={(v) => setValues({ ...values, [m.id]: v })}
                hint={`${hint} - ${m.betterIsLower ? 'Plus bas = mieux' : 'Plus haut = mieux'}`}
              />
            );
          })}

          {dungeon.kind === 'porte' && (
            <View style={styles.warning}>
              <Text style={styles.warningTitle}>Donjon de Porte</Text>
              <Text style={styles.warningText}>
                Si tu echoues, tu refais la derniere semaine de la phase avant de monter de rang.
              </Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            label={allFilled ? `Cloturer (${score.stars} etoile${score.stars > 1 ? 's' : ''})` : 'Cloturer (incomplet)'}
            onPress={submit}
            loading={submitting}
          />
          <PrimaryButton
            label="Annuler"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ScoreRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.scoreRow}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <Text style={styles.scoreValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 24, gap: 14 },
  header: { gap: 6 },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  narrative: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
  starsBlock: { flexDirection: 'row', gap: 12, alignSelf: 'center', marginVertical: 4 },
  star: { fontSize: 36, color: colors.surfaceAlt },
  starFilled: { color: colors.primary },
  scoreCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreLabel: { color: colors.textMuted, fontSize: 13 },
  scoreValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  warning: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  warningTitle: { color: colors.danger, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  warningText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  footer: { padding: 24, paddingTop: 8, gap: 4 },
});
