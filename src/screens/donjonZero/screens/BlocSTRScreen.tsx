import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components/TextField';
import type { DonjonZeroStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { BlocLayout } from '../components/BlocLayout';
import { parseNumber, useBaselineDraft } from '../hooks/useBaselineDraft';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'BlocSTR'>;

export const BlocSTRScreen = ({ navigation }: Props) => {
  const { draft, persist, loading } = useBaselineDraft();
  const [calfL, setCalfL] = useState('');
  const [calfR, setCalfR] = useState('');
  const [atgL, setAtgL] = useState('');
  const [atgR, setAtgR] = useState('');
  const [balL, setBalL] = useState('');
  const [balR, setBalR] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setCalfL(draft.calfRaisesLeft?.toString() ?? '');
    setCalfR(draft.calfRaisesRight?.toString() ?? '');
    setAtgL(draft.atgHoldLeftSec?.toString() ?? '');
    setAtgR(draft.atgHoldRightSec?.toString() ?? '');
    setBalL(draft.balanceEyesClosedLeftSec?.toString() ?? '');
    setBalR(draft.balanceEyesClosedRightSec?.toString() ?? '');
  }, [
    loading,
    draft.calfRaisesLeft,
    draft.calfRaisesRight,
    draft.atgHoldLeftSec,
    draft.atgHoldRightSec,
    draft.balanceEyesClosedLeftSec,
    draft.balanceEyesClosedRightSec,
  ]);

  const calfLNum = parseNumber(calfL);
  const calfRNum = parseNumber(calfR);
  const atgLNum = parseNumber(atgL);
  const atgRNum = parseNumber(atgR);
  const balLNum = parseNumber(balL);
  const balRNum = parseNumber(balR);

  const allFilled =
    [calfLNum, calfRNum, atgLNum, atgRNum, balLNum, balRNum].every(
      (n) => n !== null && n >= 0 && n < 1000,
    );

  const onContinue = async () => {
    setSaving(true);
    try {
      await persist(
        {
          calfRaisesLeft: calfLNum ?? undefined,
          calfRaisesRight: calfRNum ?? undefined,
          atgHoldLeftSec: atgLNum ?? undefined,
          atgHoldRightSec: atgRNum ?? undefined,
          balanceEyesClosedLeftSec: balLNum ?? undefined,
          balanceEyesClosedRightSec: balRNum ?? undefined,
        },
        false,
      );
      navigation.navigate('BlocGRP');
    } finally {
      setSaving(false);
    }
  };

  const saveAndQuit = async () => {
    setSaving(true);
    try {
      await persist(
        {
          calfRaisesLeft: calfLNum ?? undefined,
          calfRaisesRight: calfRNum ?? undefined,
          atgHoldLeftSec: atgLNum ?? undefined,
          atgHoldRightSec: atgRNum ?? undefined,
          balanceEyesClosedLeftSec: balLNum ?? undefined,
          balanceEyesClosedRightSec: balRNum ?? undefined,
        },
        false,
      );
      navigation.popToTop();
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlocLayout
      step="Donjon Zero - 3/4"
      title="Bloc STR - Structure"
      subtitle="Toujours par jambe : note gauche puis droite."
      onContinue={onContinue}
      continueDisabled={!allFilled}
      continueLoading={saving}
      onSecondary={saveAndQuit}
      secondaryLabel="Sauvegarder et reprendre plus tard"
    >
      <Text style={styles.section}>Calf raises unipodaux (reps a l'echec)</Text>
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField label="Gauche" value={calfL} onChangeText={setCalfL} keyboardType="number-pad" placeholder="0" />
        </View>
        <View style={styles.col}>
          <TextField label="Droite" value={calfR} onChangeText={setCalfR} keyboardType="number-pad" placeholder="0" />
        </View>
      </View>

      <Text style={styles.section}>ATG split squat hold (s)</Text>
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField label="Gauche" value={atgL} onChangeText={setAtgL} keyboardType="number-pad" placeholder="0" />
        </View>
        <View style={styles.col}>
          <TextField label="Droite" value={atgR} onChangeText={setAtgR} keyboardType="number-pad" placeholder="0" />
        </View>
      </View>

      <Text style={styles.section}>Equilibre unipodal yeux fermes (s)</Text>
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField label="Gauche" value={balL} onChangeText={setBalL} keyboardType="number-pad" placeholder="0" />
        </View>
        <View style={styles.col}>
          <TextField label="Droite" value={balR} onChangeText={setBalR} keyboardType="number-pad" placeholder="0" />
        </View>
      </View>
    </BlocLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
});
