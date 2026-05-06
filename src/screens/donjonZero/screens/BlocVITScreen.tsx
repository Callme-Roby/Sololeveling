import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { TextField } from '@/components/TextField';
import type { DonjonZeroStackParamList } from '@/navigation/types';

import { BlocLayout } from '../components/BlocLayout';
import {
  formatTimeSeconds,
  parseNumber,
  parseTimeSeconds,
  useBaselineDraft,
} from '../hooks/useBaselineDraft';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'BlocVIT'>;

export const BlocVITScreen = ({ navigation }: Props) => {
  const { draft, persist, loading } = useBaselineDraft();
  const [oneKm, setOneKm] = useState('');
  const [burpees, setBurpees] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setOneKm(formatTimeSeconds(draft.oneKmTimeSec));
    setBurpees(draft.burpees5MinReps?.toString() ?? '');
  }, [loading, draft.oneKmTimeSec, draft.burpees5MinReps]);

  const oneKmSec = parseTimeSeconds(oneKm);
  const burpeesNum = parseNumber(burpees);

  const valid =
    oneKmSec !== null && oneKmSec > 60 && oneKmSec < 1800 &&
    burpeesNum !== null && burpeesNum >= 0 && burpeesNum < 1000;

  const onContinue = async () => {
    setSaving(true);
    try {
      await persist(
        {
          oneKmTimeSec: oneKmSec ?? undefined,
          burpees5MinReps: burpeesNum ?? undefined,
        },
        false,
      );
      navigation.navigate('BlocAGI');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlocLayout
      step="Donjon Zero - 1/4"
      title="Bloc VIT - Cardio"
      subtitle="GPS active pour le 1 km. Repos 5 min entre les deux tests."
      onContinue={onContinue}
      continueDisabled={!valid}
      continueLoading={saving}
      onSecondary={() => navigation.goBack()}
      secondaryLabel="Retour"
    >
      <TextField
        label="1 km chrono (mm:ss)"
        value={oneKm}
        onChangeText={setOneKm}
        placeholder="5:30"
        keyboardType="numbers-and-punctuation"
        hint="Format mm:ss ou secondes (ex: 330)"
      />
      <TextField
        label="Burpees en 5 min"
        value={burpees}
        onChangeText={setBurpees}
        placeholder="60"
        keyboardType="number-pad"
        hint="Compte total sur 5 minutes"
      />
    </BlocLayout>
  );
};
