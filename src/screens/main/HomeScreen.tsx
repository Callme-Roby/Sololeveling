import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CAL_STAT_LABEL, type CalStat } from '@/data/calisthenics/catalog';
import type { CalMission } from '@/data/calisthenics/progression';
import type { CalStatTotals } from '@/data/calisthenics/progression';
import { missionForDate } from '@/data/rehab/morningMissions';
import type { RootStackParamList } from '@/navigation/types';
import { getCalMission } from '@/services/calisthenics';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

const STAT_ORDER: CalStat[] = ['PUSH', 'PULL', 'CORE', 'LEGS'];

export const HomeScreen = () => {
  const user = useAppStore((s) => s.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mission, setMission] = useState<CalMission | null>(null);
  const [totals, setTotals] = useState<CalStatTotals | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getCalMission().then(({ mission: m, totals: t }) => {
        if (cancelled) return;
        setMission(m);
        setTotals(t);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const ankle = missionForDate();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.hello}>{user ? `Salut ${user.name}` : 'Salut'}</Text>
            <Text style={styles.sub}>Ta base d'entrainement du jour</Text>
          </View>
          <View style={styles.streakPill}>
            <Text style={styles.streakIcon}>{'\u{1F525}'}</Text>
            <Text style={styles.streakVal}>{user?.streakDays ?? 0}</Text>
          </View>
        </View>

        {totals && (
          <View style={styles.statsRow}>
            {STAT_ORDER.map((s) => (
              <View key={s} style={styles.statChip}>
                <Text style={styles.statKey}>{s}</Text>
                <Text style={styles.statVal}>{Math.round(totals[s])}</Text>
                <Text style={styles.statName}>{CAL_STAT_LABEL[s]}</Text>
              </View>
            ))}
          </View>
        )}

        {/* BLOC 1 - STREET WORKOUT */}
        <Pressable
          style={[styles.block, styles.blockWorkout]}
          onPress={() => navigation.navigate('CalisthenicsSession')}
        >
          <View style={styles.blockHeader}>
            <Text style={styles.blockEmoji}>{'\u{1F3CB}\u{FE0F}'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.blockEyebrow}>Bloc 1 · Street Workout</Text>
              <Text style={styles.blockTitle}>Calisthenie</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>{mission?.dayLabel ?? 'Jour 1'}</Text>
            </View>
          </View>
          {mission && (
            <>
              <Text style={styles.blockFocus}>{mission.focus}</Text>
              <View style={styles.previewList}>
                {mission.items
                  .filter((i) => i.pattern !== 'warmup')
                  .slice(0, 4)
                  .map((i) => (
                    <Text key={i.pattern} style={styles.previewItem}>
                      {`${i.emoji}  ${i.name} — ${i.sets}x${i.target}${i.unit === 'seconds' ? 's' : ''}`}
                    </Text>
                  ))}
              </View>
              <Text style={styles.blockMeta}>{`~${mission.estimatedMinutes} min · debutant progressif`}</Text>
            </>
          )}
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Commencer la seance →</Text>
          </View>
        </Pressable>

        {/* BLOC 2 - CHEVILLE (stub) */}
        <View style={[styles.block, styles.blockAnkle]}>
          <View style={styles.blockHeader}>
            <Text style={styles.blockEmoji}>{'\u{1F9B6}'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.blockEyebrowAnkle}>Bloc 2 · Soin</Text>
              <Text style={styles.blockTitle}>Cheville</Text>
            </View>
            <View style={styles.soonBadge}>
              <Text style={styles.soonText}>Bientot</Text>
            </View>
          </View>
          <Text style={styles.blockFocus}>{ankle.title}</Text>
          <Text style={styles.ankleDetail}>{ankle.detail}</Text>
          <Text style={styles.blockMeta}>
            Suivi douleur + exercices kine a integrer (contenu a venir).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hello: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakIcon: { fontSize: 16 },
  streakVal: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statKey: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  statVal: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  statName: { color: colors.textMuted, fontSize: 9 },
  block: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 8 },
  blockWorkout: { backgroundColor: colors.surface, borderColor: colors.primary },
  blockAnkle: { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  blockHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  blockEmoji: { fontSize: 30 },
  blockEyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  blockEyebrowAnkle: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  blockTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 2 },
  dayBadge: { backgroundColor: colors.primaryMuted, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  dayBadgeText: { color: colors.textPrimary, fontSize: 12, fontWeight: '800' },
  soonBadge: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  soonText: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  blockFocus: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  previewList: { gap: 4, marginTop: 2 },
  previewItem: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  blockMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  ankleDetail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  cta: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
});
