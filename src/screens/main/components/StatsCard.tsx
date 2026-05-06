import { StyleSheet, Text, View } from 'react-native';

import { StatBar } from '@/components/StatBar';
import { colors } from '@/theme/colors';

import type { StatProgressView } from '../hooks/useStats';

interface Props {
  progress: readonly StatProgressView[];
}

const STAT_LABELS: Record<string, string> = {
  VIT: 'Vitalite',
  AGI: 'Agilite',
  STR: 'Structure',
  GRP: 'Grip',
};

export const StatsCard = ({ progress }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>Stats</Text>
    {progress.map((p) => (
      <View key={p.stat} style={styles.row}>
        <View style={styles.labelBox}>
          <Text style={styles.statKey}>{p.stat}</Text>
          <Text style={styles.statName}>{STAT_LABELS[p.stat]}</Text>
        </View>
        <StatBar progress={p.progress} />
        <View style={styles.numbers}>
          <Text style={styles.level}>{`Niv ${p.level}`}</Text>
          <Text style={styles.xp}>{`${Math.round(p.totalXp)} XP`}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelBox: { width: 70 },
  statKey: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  statName: { color: colors.textMuted, fontSize: 10 },
  numbers: { minWidth: 70, alignItems: 'flex-end' },
  level: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
  xp: { color: colors.textMuted, fontSize: 10 },
});
