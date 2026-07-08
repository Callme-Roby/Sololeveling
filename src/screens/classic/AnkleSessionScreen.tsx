import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import {
  ANKLE_REHAB_EXERCISES,
  REHAB_CATEGORY_LABEL,
  type RehabCategory,
} from '@/data/rehab/ankleRehab';
import type { RootStackParamList } from '@/navigation/types';
import { logAnkleSession } from '@/services/ankle';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AnkleSession'>;

const ORDER: RehabCategory[] = ['mobility', 'strength', 'proprioception', 'cardio_recovery'];
const PAIN_SCALE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const AnkleSessionScreen = ({ navigation }: Props) => {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [pain, setPain] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const doneCount = Object.values(done).filter(Boolean).length;

  const save = async () => {
    setSaving(true);
    try {
      const completedExerciseIds = Object.keys(done).filter((k) => done[k]);
      const numericValues: Record<string, number> = {};
      for (const id of completedExerciseIds) {
        const n = Number((values[id] ?? '').replace(',', '.'));
        if (Number.isFinite(n) && n > 0) numericValues[id] = n;
      }
      await logAnkleSession({ completedExerciseIds, values: numericValues, pain });
      Alert.alert(
        'Seance cheville enregistree',
        pain !== null
          ? `Douleur notee : ${pain}/10. Continue en douceur.`
          : 'Bien joue. Pense a noter ta douleur la prochaine fois.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Sauvegarde impossible');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Programme cheville</Text>
          <Text style={styles.title}>Seance du jour</Text>
          <Text style={styles.subtitle}>{`${doneCount} exercice(s) coche(s)`}</Text>
        </View>

        {ORDER.map((cat) => {
          const list = ANKLE_REHAB_EXERCISES.filter((e) => e.category === cat);
          if (list.length === 0) return null;
          return (
            <View key={cat} style={styles.group}>
              <Text style={styles.groupTitle}>{REHAB_CATEGORY_LABEL[cat]}</Text>
              {list.map((ex) => {
                const isDone = done[ex.id] ?? false;
                return (
                  <View key={ex.id} style={[styles.card, isDone && styles.cardDone]}>
                    <Pressable
                      style={styles.cardTop}
                      onPress={() => setDone((d) => ({ ...d, [ex.id]: !d[ex.id] }))}
                    >
                      <View style={[styles.check, isDone && styles.checkOn]}>
                        {isDone && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exName}>{ex.name}</Text>
                        <Text style={styles.exScheme}>
                          {ex.sets && ex.target
                            ? `${ex.sets} x ${ex.target}${ex.perSide ? '/cote' : ''} ${ex.unit === 'seconds' ? 'sec' : ex.unit === 'minutes' ? 'min' : 'reps'}`
                            : ex.target
                              ? `${ex.target} ${ex.unit}`
                              : ''}
                        </Text>
                      </View>
                    </Pressable>
                    <Text style={styles.instructions}>{ex.instructions}</Text>
                    {ex.caution && <Text style={styles.caution}>{ex.caution}</Text>}
                    {isDone && (
                      <TextInput
                        style={styles.input}
                        value={values[ex.id] ?? ''}
                        onChangeText={(v) => setValues((s) => ({ ...s, [ex.id]: v }))}
                        keyboardType="number-pad"
                        placeholder={`Realise (${ex.target ?? ''})`}
                        placeholderTextColor={colors.textMuted}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}

        <View style={styles.painCard}>
          <Text style={styles.groupTitle}>Douleur cheville droite (0-10)</Text>
          <Text style={styles.painHint}>0 = aucune, 10 = severe</Text>
          <View style={styles.painRow}>
            {PAIN_SCALE.map((n) => (
              <Pressable
                key={n}
                style={[styles.painDot, pain === n && styles.painDotOn]}
                onPress={() => setPain(n)}
              >
                <Text style={[styles.painText, pain === n && styles.painTextOn]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Enregistrer la seance"
          onPress={save}
          disabled={doneCount === 0 && pain === null}
          loading={saving}
        />
        <PrimaryButton label="Quitter" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 14 },
  header: { gap: 4 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 13 },
  group: { gap: 8 },
  groupTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: colors.surfaceAlt, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, gap: 6 },
  cardDone: { borderColor: colors.success },
  cardTop: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  check: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.success, borderColor: colors.success },
  checkMark: { color: colors.background, fontSize: 14, fontWeight: '800' },
  exName: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  exScheme: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  instructions: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  caution: { color: colors.danger, fontSize: 11 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: colors.textPrimary, fontSize: 15 },
  painCard: { backgroundColor: colors.surfaceAlt, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, gap: 6 },
  painHint: { color: colors.textMuted, fontSize: 11 },
  painRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  painDot: { width: 30, height: 34, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  painDotOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  painText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  painTextOn: { color: colors.textPrimary },
  footer: { padding: 16, paddingTop: 8, gap: 4 },
});
