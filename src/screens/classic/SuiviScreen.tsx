import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Validation } from '@/domain/types';
import { getAnklePainLog, type AnklePainEntry } from '@/services/ankle';
import { validationRepo } from '@/services/db';
import { colors } from '@/theme/colors';

const isSameOrAfter = (date: string, cutoff: string) => date >= cutoff;

const daysAgoIso = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const SuiviScreen = () => {
  const [validations, setValidations] = useState<readonly Validation[]>([]);
  const [pain, setPain] = useState<AnklePainEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [v, p] = await Promise.all([validationRepo.listAll(), getAnklePainLog()]);
      setValidations(v);
      setPain(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const weekCutoff = daysAgoIso(7);
  const weekCount = validations.filter((v) => isSameOrAfter(v.date, weekCutoff)).length;
  const ankleCount = validations.filter((v) => v.exerciseId.startsWith('ankle_')).length;
  const workoutCount = validations.filter((v) => !v.exerciseId.startsWith('ankle_')).length;
  const recent = [...validations].slice(0, 20);
  const lastPain = pain[pain.length - 1];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <Text style={styles.title}>Suivi</Text>

        <View style={styles.kpiRow}>
          <Kpi value={String(weekCount)} label="7 derniers jours" />
          <Kpi value={String(workoutCount)} label="Renforcement" />
          <Kpi value={String(ankleCount)} label="Cheville" />
        </View>

        {lastPain && (
          <View style={styles.painCard}>
            <Text style={styles.cardLabel}>Douleur cheville (derniere)</Text>
            <Text style={styles.painVal}>{`${lastPain.pain}/10`}</Text>
            <Text style={styles.painDate}>{lastPain.date}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Activite recente</Text>
        {recent.length === 0 ? (
          <Text style={styles.empty}>Aucune seance enregistree pour l'instant.</Text>
        ) : (
          <View style={styles.list}>
            {recent.map((v) => (
              <View key={v.id} style={styles.row}>
                <View
                  style={[
                    styles.rowDot,
                    { backgroundColor: v.exerciseId.startsWith('ankle_') ? colors.success : colors.primary },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{v.notes ?? v.exerciseId}</Text>
                  <Text style={styles.rowMeta}>
                    {`${v.date} · ${v.value} ${v.unit === 'seconds' ? 'sec' : v.unit === 'minutes' ? 'min' : v.unit === 'meters' ? 'm' : 'reps'}`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Kpi = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.kpi}>
    <Text style={styles.kpiVal}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 8 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpi: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, alignItems: 'center' },
  kpiVal: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  kpiLabel: { color: colors.textMuted, fontSize: 10, textAlign: 'center' },
  painCard: { backgroundColor: colors.surfaceAlt, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14 },
  cardLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  painVal: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  painDate: { color: colors.textMuted, fontSize: 12 },
  sectionTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  empty: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  list: { gap: 8 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: 10, borderWidth: 1, borderColor: colors.border, padding: 12 },
  rowDot: { width: 8, height: 8, borderRadius: 4 },
  rowTitle: { color: colors.textPrimary, fontSize: 14 },
  rowMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
