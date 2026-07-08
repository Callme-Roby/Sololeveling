import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatBar } from '@/components/StatBar';
import { CAL_STATS, CAL_STAT_LABEL } from '@/data/calisthenics/catalog';
import type { CalMission, CalStatTotals } from '@/data/calisthenics/progression';
import type { RootStackParamList } from '@/navigation/types';
import { getCalMission } from '@/services/calisthenics';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

const maxTotal = (t: CalStatTotals) =>
  Math.max(10, ...CAL_STATS.map((s) => t[s]));

export const AccueilScreen = () => {
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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.hello}>{user ? `Salut ${user.name}` : 'Salut'}</Text>
            <Text style={styles.sub}>Ton programme du jour</Text>
          </View>
          {user && user.streakDays > 0 && (
            <View style={styles.streak}>
              <Text style={styles.streakVal}>{user.streakDays}</Text>
              <Text style={styles.streakLabel}>jours</Text>
            </View>
          )}
        </View>

        {/* Programme renforcement */}
        <Pressable
          style={[styles.block, styles.blockWorkout]}
          onPress={() => navigation.navigate('CalisthenicsSession')}
        >
          <Text style={styles.blockEyebrow}>Renforcement · Street Workout</Text>
          <Text style={styles.blockTitle}>{mission?.dayLabel ?? 'Seance du jour'}</Text>
          {mission && <Text style={styles.blockFocus}>{mission.focus}</Text>}
          {mission && (
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
          )}
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Commencer la seance →</Text>
          </View>
        </Pressable>

        {/* Programme cheville */}
        <Pressable
          style={[styles.block, styles.blockAnkle]}
          onPress={() => navigation.navigate('AnkleSession')}
        >
          <Text style={styles.blockEyebrowAlt}>Reeducation cheville</Text>
          <Text style={styles.blockTitle}>Seance cheville</Text>
          <Text style={styles.blockFocus}>Mobilite · renforcement · equilibre · suivi douleur</Text>
          <View style={styles.ctaAlt}>
            <Text style={styles.ctaTextAlt}>Ouvrir →</Text>
          </View>
        </Pressable>

        {/* Progression muscles */}
        {totals && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Progression</Text>
            {CAL_STATS.map((s) => (
              <View key={s} style={styles.statRow}>
                <Text style={styles.statKey}>{CAL_STAT_LABEL[s]}</Text>
                <StatBar progress={Math.min(1, totals[s] / maxTotal(totals))} />
                <Text style={styles.statVal}>{Math.round(totals[s])}</Text>
              </View>
            ))}
          </View>
        )}
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
  streak: { alignItems: 'center', backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  streakVal: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  streakLabel: { color: colors.textMuted, fontSize: 9 },
  block: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 6 },
  blockWorkout: { backgroundColor: colors.surface, borderColor: colors.primary },
  blockAnkle: { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  blockEyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  blockEyebrowAlt: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  blockTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '800' },
  blockFocus: { color: colors.textSecondary, fontSize: 14 },
  previewList: { gap: 4, marginTop: 4 },
  previewItem: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  cta: { marginTop: 8, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  ctaText: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
  ctaAlt: { marginTop: 6, alignSelf: 'flex-start' },
  ctaTextAlt: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  statsCard: { backgroundColor: colors.surfaceAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 },
  statsTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statKey: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', width: 84 },
  statVal: { color: colors.textPrimary, fontSize: 12, fontWeight: '700', minWidth: 32, textAlign: 'right' },
});
