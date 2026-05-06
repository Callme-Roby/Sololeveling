import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { TextField } from '@/components/TextField';
import type { DonjonZeroStackParamList } from '@/navigation/types';

import { BlocLayout } from '../components/BlocLayout';
import { parseNumber, useBaselineDraft } from '../hooks/useBaselineDraft';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'BlocAGI'>;

export const BlocAGIScreen = ({ navigation }: Props) => {
  const { draft, persist, loading } = useBaselineDraft();
  const [broad, setBroad] = useState('');
  const [sprint, setSprint] = useState('');
  const [box, setBox] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setBroad(draft.broadJumpCm?.toString() ?? '');
    setSprint(draft.sprint30mSec?.toString() ?? '');
    setBox(draft.boxJumpHeightCm?.toString() ?? '');
  }, [loading, draft.broadJumpCm, draft.sprint30mSec, draft.boxJumpHeightCm]);

  const broadNum = parseNumber(broad);
  const sprintNum = parseNumber(sprint);
  const boxNum = parseNumber(box);

  const valid =
    broadNum !== null && broadNum > 30 && broadNum < 400 &&
    sprintNum !== null && sprintNum > 2 && sprintNum < 30 &&
    boxNum !== null && boxNum > 5 && boxNum < 200;

  const onContinue = async () => {
    setSaving(true);
    try {
      await persist(
        {
          broadJumpCm: broadNum ?? undefined,
          sprint30mSec: sprintNum ?? undefined,
          boxJumpHeightCm: boxNum ?? undefined,
        },
        false,
      );
      navigation.navigate('BlocSTR');
    } finally {
      setSaving(false);
    }
  };

  const saveAndQuit = async () => {
    setSaving(true);
    try {
      await persist(
        {
          broadJumpCm: broadNum ?? undefined,
          sprint30mSec: sprintNum ?? undefined,
          boxJumpHeightCm: boxNum ?? undefined,
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
      step="Donjon Zero - 2/4"
      title="Bloc AGI - Explosivite"
      subtitle="3 essais par test, garde le meilleur. Atterrir stable."
      onContinue={onContinue}
      continueDisabled={!valid}
      continueLoading={saving}
      onSecondary={saveAndQuit}
      secondaryLabel="Sauvegarder et reprendre plus tard"
    >
      <TextField
        label="Broad jump max (cm)"
        value={broad}
        onChangeText={setBroad}
        placeholder="180"
        keyboardType="number-pad"
      />
      <TextField
        label="Sprint 30 m (s)"
        value={sprint}
        onChangeText={setSprint}
        placeholder="5.2"
        keyboardType="decimal-pad"
        hint="Meilleur des 2 essais"
      />
      <TextField
        label="Box jump hauteur max (cm)"
        value={box}
        onChangeText={setBox}
        placeholder="50"
        keyboardType="number-pad"
        hint="Atterrir maitrise"
      />
    </BlocLayout>
  );
};
