import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components/TextField';
import type { DonjonZeroStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { BlocLayout } from '../components/BlocLayout';
import { parseNumber, useBaselineDraft } from '../hooks/useBaselineDraft';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'BlocGRP'>;

export const BlocGRPScreen = ({ navigation }: Props) => {
  const { draft, persist, loading } = useBaselineDraft();
  const [hang, setHang] = useState('');
  const [tennisL, setTennisL] = useState('');
  const [tennisR, setTennisR] = useState('');
  const [farmer, setFarmer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setHang(draft.deadHangMaxSec?.toString() ?? '');
    setTennisL(draft.tennisBallLeftSec?.toString() ?? '');
    setTennisR(draft.tennisBallRightSec?.toString() ?? '');
    setFarmer(draft.farmerCarryDistanceM?.toString() ?? '');
  }, [
    loading,
    draft.deadHangMaxSec,
    draft.tennisBallLeftSec,
    draft.tennisBallRightSec,
    draft.farmerCarryDistanceM,
  ]);

  const hangNum = parseNumber(hang);
  const tennisLNum = parseNumber(tennisL);
  const tennisRNum = parseNumber(tennisR);
  const farmerNum = parseNumber(farmer);

  const valid =
    hangNum !== null && hangNum >= 0 && hangNum < 1000 &&
    tennisLNum !== null && tennisLNum >= 0 && tennisLNum < 1000 &&
    tennisRNum !== null && tennisRNum >= 0 && tennisRNum < 1000 &&
    farmerNum !== null && farmerNum >= 0 && farmerNum < 5000;

  const onContinue = async () => {
    setSaving(true);
    try {
      await persist(
        {
          deadHangMaxSec: hangNum ?? undefined,
          tennisBallLeftSec: tennisLNum ?? undefined,
          tennisBallRightSec: tennisRNum ?? undefined,
          farmerCarryDistanceM: farmerNum ?? undefined,
        },
        false,
      );
      navigation.navigate('Sensation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlocLayout
      step="Donjon Zero - 4/4"
      title="Bloc GRP - Grip"
      subtitle="La fondation. Note tout, meme si les chiffres semblent bas."
      onContinue={onContinue}
      continueDisabled={!valid}
      continueLoading={saving}
      onSecondary={() => navigation.goBack()}
      secondaryLabel="Retour"
    >
      <TextField
        label="Dead hang max (s)"
        value={hang}
        onChangeText={setHang}
        keyboardType="number-pad"
        placeholder="30"
      />
      <Text style={styles.section}>Tennis ball squeeze max (s)</Text>
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField label="Gauche" value={tennisL} onChangeText={setTennisL} keyboardType="number-pad" placeholder="0" />
        </View>
        <View style={styles.col}>
          <TextField label="Droite" value={tennisR} onChangeText={setTennisR} keyboardType="number-pad" placeholder="0" />
        </View>
      </View>
      <TextField
        label="Farmer carry distance totale (m)"
        value={farmer}
        onChangeText={setFarmer}
        keyboardType="number-pad"
        placeholder="50"
        hint="Sacs ~10 kg/main, jusqu'a devoir poser"
      />
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
