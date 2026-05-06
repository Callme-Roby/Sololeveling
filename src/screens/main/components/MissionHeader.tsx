import { StyleSheet, Text, View } from 'react-native';

import type { Rank } from '@/domain/types';
import { colors } from '@/theme/colors';
import { dayNames, labelForWorkoutType } from '@/utils/format';

interface Props {
  rank: Rank;
  streakDays: number;
  weekNumber: number;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  workoutTypeLabel: string;
  hunterName: string;
}

export const MissionHeader = ({
  rank,
  streakDays,
  weekNumber,
  dayOfWeek,
  workoutTypeLabel,
  hunterName,
}: Props) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <View>
        <Text style={styles.eyebrow}>{`Semaine ${weekNumber} - ${dayNames[dayOfWeek]}`}</Text>
        <Text style={styles.title}>{hunterName}</Text>
        <Text style={styles.subtitle}>{workoutTypeLabel}</Text>
      </View>
      <View style={styles.badges}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankLabel}>RANG</Text>
          <Text style={styles.rankValue}>{rank}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>{'\u{1F525}'}</Text>
          <Text style={styles.streakValue}>{streakDays}</Text>
          <Text style={styles.streakLabel}>j</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 4 },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8 },
  rankBadge: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 48,
  },
  rankLabel: { color: colors.primary, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  rankValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  streakBadge: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  streakIcon: { fontSize: 16 },
  streakValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  streakLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
});
