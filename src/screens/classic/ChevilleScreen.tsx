import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import {
  ANKLE_REHAB_EXERCISES,
  REHAB_CATEGORY_LABEL,
  type RehabCategory,
} from '@/data/rehab/ankleRehab';
import type { RootStackParamList } from '@/navigation/types';
import { getAnklePainLog, type AnklePainEntry } from '@/services/ankle';
import { colors } from '@/theme/colors';

const ORDER: RehabCategory[] = ['mobility', 'strength', 'proprioception', 'cardio_recovery'];

export const ChevilleScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [log, setLog] = useState<AnklePainEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getAnklePainLog().then((l) => {
        if (!cancelled) setLog(l);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const last = log[log.length - 1];
  const recent = log.slice(-7);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Cheville</Text>
        <Text style={styles.subtitle}>Reeducation + suivi de la douleur (cheville droite)</Text>

        <View style={styles.painCard}>
          <Text style={styles.cardLabel}>Derniere douleur notee</Text>
          {last ? (
            <>
              <Text style={styles.painValue}>{`${last.pain}/10`}</Text>
              <Text style={styles.painDate}>{last.date}</Text>
              {recent.length > 1 && (
                <View style={styles.trend}>
                  {recent.map((e) => (
                    <View key={e.date} style={styles.trendCol}>
                      <View
                        style={[
                          styles.trendBar,
                          { height: 6 + e.pain * 5, backgroundColor: e.pain >= 5 ? colors.danger : colors.primary },
                        ]}
                      />
                      <Text style={styles.trendLabel}>{e.date.slice(5)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.empty}>Aucune douleur notee pour l'instant.</Text>
          )}
        </View>

        <PrimaryButton
          label="Demarrer une seance cheville"
          onPress={() => navigation.navigate('AnkleSession')}
        />

        <Text style={styles.sectionTitle}>Exercices du programme</Text>
        {ORDER.map((cat) => {
          const list = ANKLE_REHAB_EXERCISES.filter((e) => e.category === cat);
          if (!list.length) return null;
          return (
            <View key={cat} style={styles.group}>
              <Text style={styles.groupTitle}>{REHAB_CATEGORY_LABEL[cat]}</Text>
              {list.map((ex) => (
                <View key={ex.id} style={styles.exRow}>
                  <View style={styles.dot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exMeta}>
                      {ex.sets && ex.target
                        ? `${ex.sets} x ${ex.target}${ex.perSide ? '/cote' : ''}`
                        : ex.target
                          ? `${ex.target} ${ex.unit}`
                          : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <Text style={styles.footnote}>
          Contenu de depart. Tu pourras remplacer ces exercices par ceux de
          ton kine des que tu me les envoies.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 13 },
  painCard: { backgroundColor: colors.surfaceAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 4 },
  cardLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  painValue: { color: colors.textPrimary, fontSize: 28, fontWeight: '800' },
  painDate: { color: colors.textMuted, fontSize: 12 },
  empty: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  trend: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 10, height: 70 },
  trendCol: { alignItems: 'center', gap: 4 },
  trendBar: { width: 16, borderRadius: 4 },
  trendLabel: { color: colors.textMuted, fontSize: 8 },
  sectionTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  group: { gap: 6 },
  groupTitle: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  exRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 3 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 6 },
  exName: { color: colors.textPrimary, fontSize: 14 },
  exMeta: { color: colors.textMuted, fontSize: 11 },
  footnote: { color: colors.textMuted, fontSize: 12, fontStyle: 'italic', marginTop: 4 },
});
