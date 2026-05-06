import { StyleSheet, Text, View } from 'react-native';

import { STATS } from '@/domain/types';
import { colors } from '@/theme/colors';

const STAT_LABELS: Record<string, string> = {
  VIT: 'Vitalite',
  AGI: 'Agilite',
  STR: 'Structure',
  GRP: 'Grip',
};

export const StatsStubCard = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Stats</Text>
    {STATS.map((stat) => (
      <View key={stat} style={styles.row}>
        <View style={styles.labelBox}>
          <Text style={styles.statKey}>{stat}</Text>
          <Text style={styles.statName}>{STAT_LABELS[stat]}</Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: '0%' }]} />
        </View>
        <Text style={styles.value}>0</Text>
      </View>
    ))}
    <Text style={styles.footnote}>Calcul XP + barres animees : lot 6.</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 10,
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
  bar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fill: { height: '100%', backgroundColor: colors.primary },
  value: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', minWidth: 40, textAlign: 'right' },
  footnote: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic', marginTop: 4 },
});
