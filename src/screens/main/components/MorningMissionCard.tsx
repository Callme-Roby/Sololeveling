import { StyleSheet, Text, View } from 'react-native';

import { getRehabExercise, REHAB_CATEGORY_LABEL } from '@/data/rehab/ankleRehab';
import { missionForDate, type MorningMission } from '@/data/rehab/morningMissions';
import { colors } from '@/theme/colors';

interface Props {
  mission?: MorningMission;
}

export const MorningMissionCard = ({ mission = missionForDate() }: Props) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.eyebrow}>Mission du matin</Text>
      <Text style={styles.badge}>{`~${mission.estimatedMinutes} min`}</Text>
    </View>
    <Text style={styles.title}>{mission.title}</Text>
    <Text style={styles.detail}>{mission.detail}</Text>
    <Text style={styles.focus}>{REHAB_CATEGORY_LABEL[mission.focus]}</Text>
    <View style={styles.exList}>
      {mission.exerciseIds.map((id) => {
        const ex = getRehabExercise(id);
        if (!ex) return null;
        return (
          <View key={id} style={styles.exRow}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.exName}>
                {ex.name}
                {ex.sets && ex.target
                  ? `  ${ex.sets}x${ex.target}${ex.perSide ? '/cote' : ''}`
                  : ex.target
                    ? `  ${ex.target} ${ex.unit}`
                    : ''}
              </Text>
              {ex.caution && <Text style={styles.caution}>{ex.caution}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 14,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badge: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  detail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  focus: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  exList: { gap: 6, marginTop: 6 },
  exRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  exName: { color: colors.textPrimary, fontSize: 14, lineHeight: 19 },
  caution: { color: colors.danger, fontSize: 11, marginTop: 1 },
});
