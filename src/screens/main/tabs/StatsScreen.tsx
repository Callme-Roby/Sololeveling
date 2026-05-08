import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatBar } from '@/components/StatBar';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

import { useStats } from '../hooks/useStats';

const STAT_LABELS: Record<string, string> = {
  VIT: 'Vitalite',
  AGI: 'Agilite',
  STR: 'Structure',
  GRP: 'Grip',
};

const STAT_DESCRIPTIONS: Record<string, string> = {
  VIT: 'Cardio + resistance',
  AGI: 'Explosivite',
  STR: 'Articulations + plyo',
  GRP: 'Prehension',
};

export const StatsScreen = () => {
  const user = useAppStore((s) => s.user);
  const stats = useStats();

  useFocusEffect(
    useCallback(() => {
      stats.refresh();
    }, [stats]),
  );

  if (!user) return null;

  const daysSinceStart = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(user.startDate).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={stats.loading}
            onRefresh={stats.refresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.title}>Stats</Text>
        <View style={styles.summary}>
          <Summary value={user.rank} label="Rang" />
          <Summary value={`${user.streakDays}j`} label="Streak" />
          <Summary value={`J${daysSinceStart + 1}`} label="Programme" />
        </View>

        {stats.progress.map((p) => (
          <View key={p.stat} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View>
                <Text style={styles.statKey}>{p.stat}</Text>
                <Text style={styles.statName}>{STAT_LABELS[p.stat]}</Text>
                <Text style={styles.statDesc}>{STAT_DESCRIPTIONS[p.stat]}</Text>
              </View>
              <View style={styles.statRight}>
                <Text style={styles.level}>{`Niv ${p.level}`}</Text>
                <Text style={styles.xp}>{`${Math.round(p.totalXp)} XP`}</Text>
              </View>
            </View>
            <StatBar progress={p.progress} height={10} />
            <Text style={styles.progress}>{`${Math.round(p.progress * 100)}% du prochain niveau`}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Summary = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 8,
  },
  summary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: 'center',
  },
  summaryValue: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  summaryLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  statCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statKey: { color: colors.primary, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  statName: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 2 },
  statDesc: { color: colors.textMuted, fontSize: 12 },
  statRight: { alignItems: 'flex-end' },
  level: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  xp: { color: colors.textMuted, fontSize: 12 },
  progress: { color: colors.textMuted, fontSize: 11 },
});
