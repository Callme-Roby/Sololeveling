import { StyleSheet, Text, View } from 'react-native';

import { getExercise } from '@/data/exercises';
import { getWeeklyDungeon } from '@/data/weeklyDungeons';
import type { Workout } from '@/domain/types';
import { colors } from '@/theme/colors';
import { formatPlannedExercise, labelForWorkoutType } from '@/utils/format';

interface Props {
  workout: Workout | undefined;
}

export const SessionCard = ({ workout }: Props) => {
  if (!workout) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Pas de seance prevue</Text>
        <Text style={styles.detail}>Repos. Quetes journalieres a tenir quand meme.</Text>
      </View>
    );
  }

  if (workout.isBossDay) {
    const dungeon = getWeeklyDungeon(workout.weekNumber);
    return (
      <View style={[styles.card, styles.bossCard]}>
        <View style={styles.bossHeader}>
          <Text style={styles.bossEmoji}>{dungeon?.emoji ?? '\u{1F3DB}\u{FE0F}'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bossEyebrow}>Donjon Hebdo</Text>
            <Text style={styles.bossTitle}>{dungeon?.name ?? workout.title}</Text>
          </View>
        </View>
        {dungeon?.narrative && (
          <Text style={styles.bossNarrative}>{dungeon.narrative}</Text>
        )}
        <View style={styles.bossMarkers}>
          <Text style={styles.markerLabel}>Marqueurs a relever</Text>
          {dungeon?.protocol.map((m) => (
            <View key={m.id} style={styles.markerRow}>
              <Text style={styles.markerDot}>{'•'}</Text>
              <Text style={styles.markerText}>{m.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footnote}>
          Saisie + scoring etoiles : lot 8.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Seance du jour</Text>
        <Text style={styles.typeBadge}>{labelForWorkoutType(workout.type)}</Text>
      </View>
      <Text style={styles.workoutTitle}>{workout.title}</Text>
      {workout.plannedExercises.length === 0 ? (
        <Text style={styles.detail}>Repos actif. Mobilite + hangs passifs.</Text>
      ) : (
        <View style={styles.exList}>
          {workout.plannedExercises.map((p, i) => {
            const ex = getExercise(p.exerciseId);
            return (
              <View key={`${p.exerciseId}-${i}`} style={styles.exRow}>
                <View style={styles.exDot} />
                <View style={styles.exContent}>
                  <Text style={styles.exName}>
                    {formatPlannedExercise(p, ex)}
                  </Text>
                  {ex?.lestable && (
                    <Text style={styles.exTag}>Lestable</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  bossCard: { borderColor: colors.primary, backgroundColor: colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  typeBadge: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  workoutTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginVertical: 4 },
  detail: { color: colors.textSecondary, fontSize: 13 },
  exList: { gap: 6, marginTop: 4 },
  exRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 4 },
  exDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 6 },
  exContent: { flex: 1 },
  exName: { color: colors.textPrimary, fontSize: 14, lineHeight: 19 },
  exTag: { color: colors.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  bossHeader: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 4 },
  bossEmoji: { fontSize: 28 },
  bossEyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  bossTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  bossNarrative: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic', marginTop: 4, lineHeight: 19 },
  bossMarkers: { gap: 4, marginTop: 8 },
  markerLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  markerRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  markerDot: { color: colors.primary, fontSize: 14, lineHeight: 19 },
  markerText: { color: colors.textPrimary, fontSize: 13, lineHeight: 19, flex: 1 },
  footnote: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic', marginTop: 6 },
});
