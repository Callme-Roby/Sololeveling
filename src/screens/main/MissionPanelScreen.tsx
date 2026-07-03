import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LestageSheet } from '@/components/LestageSheet';
import { getExercise } from '@/data/exercises';
import type { Exercise, ExerciseUnit, PlannedExercise } from '@/domain/types';
import type { RootStackParamList } from '@/navigation/types';
import { persistStreak, recomputeStreakDays } from '@/services/dailyRollover';
import { dailyQuestRepo } from '@/services/db';
import { recordValidation } from '@/services/recordValidation';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';
import { labelForWorkoutType } from '@/utils/format';

import { InventoryCard } from './components/InventoryCard';
import { MissionHeader } from './components/MissionHeader';
import { MorningMissionCard } from './components/MorningMissionCard';
import { QuestsCard } from './components/QuestsCard';
import { SessionCard } from './components/SessionCard';
import { StatsCard } from './components/StatsCard';
import { useTodayPanel } from './hooks/useTodayPanel';
import { useStats } from './hooks/useStats';
import { questTargetForKind, type QuestKind, type QuestTarget } from './hooks/useQuestTargets';

interface QuestSheetTarget {
  kind: 'quest';
  exercise: Exercise;
  unit: ExerciseUnit;
  unitLabel: string;
  target: QuestTarget;
  defaultValue: string;
}

interface SessionSheetTarget {
  kind: 'session';
  exercise: Exercise;
  unit: ExerciseUnit;
  unitLabel: string;
  planned: PlannedExercise;
  defaultValue: string;
}

type SheetTarget = QuestSheetTarget | SessionSheetTarget;

const unitLabel = (unit: ExerciseUnit): string => {
  switch (unit) {
    case 'reps': return 'reps';
    case 'seconds': return 'secondes';
    case 'meters': return 'metres';
    case 'minutes': return 'minutes';
  }
};

const inferPlannedUnit = (
  planned: PlannedExercise,
  exercise: Exercise,
): { unit: ExerciseUnit; defaultValue: string } => {
  if (planned.durationSecPerSet !== undefined) {
    return { unit: 'seconds', defaultValue: String(planned.durationSecPerSet) };
  }
  if (planned.distanceMPerSet !== undefined) {
    return { unit: 'meters', defaultValue: String(planned.distanceMPerSet) };
  }
  if (planned.repsPerSet !== undefined) {
    return { unit: 'reps', defaultValue: String(planned.repsPerSet) };
  }
  if (planned.totalDurationMin !== undefined) {
    return { unit: 'minutes', defaultValue: String(planned.totalDurationMin) };
  }
  if (planned.totalReps !== undefined) {
    return { unit: 'reps', defaultValue: String(planned.totalReps) };
  }
  return { unit: exercise.unit, defaultValue: '' };
};

export const MissionPanelScreen = () => {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const today = useTodayPanel();
  const stats = useStats();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sheet, setSheet] = useState<SheetTarget | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refreshToday = today.refresh;
  const refreshStats = stats.refresh;
  useFocusEffect(
    useCallback(() => {
      refreshToday();
      refreshStats();
    }, [refreshToday, refreshStats]),
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const onPressQuest = (kind: QuestKind) => {
    const target = questTargetForKind(kind, today.questPlan);
    const exercise = getExercise(target.exerciseId);
    if (!exercise) return;
    setSheet({
      kind: 'quest',
      exercise,
      unit: target.unit,
      unitLabel: target.unitLabel,
      target,
      defaultValue: String(target.defaultValue),
    });
  };

  const onPressExercise = (planned: PlannedExercise, exercise: Exercise) => {
    const inferred = inferPlannedUnit(planned, exercise);
    setSheet({
      kind: 'session',
      exercise,
      unit: inferred.unit,
      unitLabel: unitLabel(inferred.unit),
      planned,
      defaultValue: inferred.defaultValue,
    });
  };

  const handleSubmit = async ({
    value,
    loadKg,
  }: {
    value: number;
    loadKg: number;
  }) => {
    if (!sheet) return;
    setSubmitting(true);
    try {
      const result = await recordValidation({
        exerciseId: sheet.exercise.id,
        value,
        unit: sheet.unit,
        loadKg,
        bodyWeightKg: user.bodyWeightKg,
        streakDays: user.streakDays,
        workoutId: today.workout?.id,
      });

      if (sheet.kind === 'quest') {
        const existing = today.questRecord;
        const t = sheet.target;
        await dailyQuestRepo.upsert({
          date: today.todayIso,
          hangCompleted: existing?.hangCompleted ?? false,
          hangSeconds: existing?.hangSeconds ?? 0,
          hangLoadKg: existing?.hangLoadKg ?? 0,
          calvesCompleted: existing?.calvesCompleted ?? false,
          calvesLoadKg: existing?.calvesLoadKg ?? 0,
          atgCompleted: existing?.atgCompleted ?? false,
          atgSeconds: existing?.atgSeconds ?? 0,
          crushCompleted: existing?.crushCompleted ?? false,
          crushSeconds: existing?.crushSeconds ?? 0,
          penaltyApplied: existing?.penaltyApplied ?? false,
          [t.questCompletedField]: true,
          ...(t.questValueField ? { [t.questValueField]: value } : {}),
          ...(t.questLoadField ? { [t.questLoadField]: loadKg } : {}),
        });
        const newStreak = await recomputeStreakDays(today.todayIso);
        const updatedUser = await persistStreak(user, newStreak);
        if (updatedUser !== user) setUser(updatedUser);
      }

      setSheet(null);
      await Promise.all([today.refresh(), stats.refresh()]);

      if (result.isPersonalRecord) {
        Alert.alert(
          'Nouveau record personnel',
          `${sheet.exercise.name} : ${value} ${unitLabel(sheet.unit)}${
            loadKg > 0 ? ` + ${loadKg} kg` : ''
          }\n+${result.xpEarned.toFixed(1)} XP`,
        );
      }
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Impossible de sauvegarder.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const workoutTypeLabel = today.workout
    ? labelForWorkoutType(today.workout.type)
    : 'Repos';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <MissionHeader
        rank={user.rank}
        streakDays={user.streakDays}
        weekNumber={today.weekNumber}
        dayOfWeek={today.dayOfWeek}
        workoutTypeLabel={workoutTypeLabel}
        hunterName={user.name}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={today.loading}
            onRefresh={today.refresh}
            tintColor={colors.primary}
          />
        }
      >
        <MorningMissionCard />
        {today.questRecord?.penaltyApplied && (
          <View style={styles.penaltyBanner}>
            <View style={styles.penaltyDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.penaltyTitle}>Penalite : volume double</Text>
              <Text style={styles.penaltyBody}>
                Quete ratee hier. Aujourd'hui, fais le double pour rattraper.
              </Text>
            </View>
          </View>
        )}
        {user.mustRedoFromWeek !== null && (
          <View style={styles.redoBanner}>
            <View style={styles.penaltyDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.redoTitle}>{`Tu refais la semaine ${user.mustRedoFromWeek}`}</Text>
              <Text style={styles.penaltyBody}>
                Donjon de Porte rate. Termine la semaine et retente le donjon.
              </Text>
            </View>
          </View>
        )}
        <QuestsCard
          plan={today.questPlan}
          record={today.questRecord}
          onPressQuest={onPressQuest}
        />
        <SessionCard
          workout={today.workout}
          todayValidations={today.todayValidations}
          onPressExercise={onPressExercise}
          onLaunchGps={(exerciseId, workoutId) =>
            navigation.navigate('Run', { exerciseId, workoutId })
          }
          onEnterDungeon={(weekNumber) =>
            navigation.navigate('DungeonRun', { weekNumber })
          }
        />
        <StatsCard progress={stats.progress} />
        <InventoryCard titles={today.titles} />
      </ScrollView>
      {sheet && (
        <LestageSheet
          visible
          exercise={sheet.exercise}
          unitLabel={sheet.unitLabel}
          unitOverride={sheet.unit}
          initialValue={sheet.defaultValue}
          onCancel={() => setSheet(null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  penaltyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 14,
  },
  penaltyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },
  penaltyTitle: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  penaltyBody: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  redoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 14,
  },
  redoTitle: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
