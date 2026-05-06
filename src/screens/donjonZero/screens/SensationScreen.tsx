import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DonjonZeroStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { BlocLayout } from '../components/BlocLayout';
import { useBaselineDraft } from '../hooks/useBaselineDraft';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'Sensation'>;

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const ScaleRow = ({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number | null;
  onChange: (n: number) => void;
}) => (
  <View style={styles.scaleBlock}>
    <Text style={styles.scaleLabel}>{label}</Text>
    {hint && <Text style={styles.scaleHint}>{hint}</Text>}
    <View style={styles.scaleRow}>
      {SCALE.map((n) => (
        <Pressable
          key={n}
          style={[styles.dot, value === n && styles.dotActive]}
          onPress={() => onChange(n)}
        >
          <Text style={[styles.dotText, value === n && styles.dotTextActive]}>{n}</Text>
        </Pressable>
      ))}
    </View>
  </View>
);

export const SensationScreen = ({ navigation }: Props) => {
  const { draft, persist, loading } = useBaselineDraft();
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [motivation, setMotivation] = useState<number | null>(null);
  const [pain, setPain] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setEnergy(draft.energy ?? null);
    setSleep(draft.sleep ?? null);
    setMotivation(draft.motivation ?? null);
    setPain(draft.pain ?? null);
  }, [loading, draft.energy, draft.sleep, draft.motivation, draft.pain]);

  const valid =
    energy !== null && sleep !== null && motivation !== null && pain !== null;

  const onContinue = async () => {
    setSaving(true);
    try {
      await persist(
        {
          energy: energy ?? undefined,
          sleep: sleep ?? undefined,
          motivation: motivation ?? undefined,
          pain: pain ?? undefined,
        },
        true,
      );
      navigation.navigate('Complete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlocLayout
      step="Donjon Zero - Sensation"
      title="Forme globale"
      subtitle="1 = au plus bas. 10 = au top. Pour la douleur : 1 = aucune, 10 = severe."
      onContinue={onContinue}
      continueDisabled={!valid}
      continueLoading={saving}
      continueLabel="Cloturer le Donjon Zero"
    >
      <ScaleRow label="Energie" value={energy} onChange={setEnergy} />
      <ScaleRow label="Sommeil" value={sleep} onChange={setSleep} />
      <ScaleRow label="Motivation" value={motivation} onChange={setMotivation} />
      <ScaleRow
        label="Douleurs"
        hint="1 = aucune, 10 = severes"
        value={pain}
        onChange={setPain}
      />
    </BlocLayout>
  );
};

const styles = StyleSheet.create({
  scaleBlock: { gap: 8, marginVertical: 8 },
  scaleLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  scaleHint: { color: colors.textMuted, fontSize: 12 },
  scaleRow: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  dot: {
    width: 28,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  dotTextActive: { color: colors.textPrimary, fontWeight: '800' },
});
