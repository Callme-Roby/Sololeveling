import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { Exercise, ExerciseUnit } from '@/domain/types';
import { getLastLoad } from '@/services/lestageMemory';
import { colors } from '@/theme/colors';

interface Props {
  visible: boolean;
  exercise: Exercise;
  unitLabel?: string;
  unitOverride?: ExerciseUnit;
  initialValue?: string;
  onCancel: () => void;
  onSubmit: (input: { value: number; loadKg: number }) => void | Promise<void>;
  submitting?: boolean;
}

const unitToPlaceholder = (unit: ExerciseUnit): string => {
  switch (unit) {
    case 'reps':
      return 'reps';
    case 'seconds':
      return 'secondes';
    case 'meters':
      return 'metres';
    case 'minutes':
      return 'minutes';
    default:
      return '';
  }
};

export const LestageSheet = ({
  visible,
  exercise,
  unitLabel,
  unitOverride,
  initialValue = '',
  onCancel,
  onSubmit,
  submitting,
}: Props) => {
  const unit = unitOverride ?? exercise.unit;
  const [value, setValue] = useState(initialValue);
  const [load, setLoad] = useState('0');
  const [valueError, setValueError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setValue(initialValue);
    setValueError(null);
    if (exercise.lestable) {
      getLastLoad(exercise.id).then((kg) => {
        setLoad(kg > 0 ? String(kg) : '0');
      });
    } else {
      setLoad('0');
    }
  }, [visible, exercise.id, exercise.lestable, initialValue]);

  const handleSubmit = async () => {
    const valueNum = Number(value.replace(',', '.'));
    if (!Number.isFinite(valueNum) || valueNum <= 0) {
      setValueError('Saisis une valeur > 0');
      return;
    }
    const loadNum = exercise.lestable
      ? Math.max(0, Number(load.replace(',', '.')) || 0)
      : 0;
    await onSubmit({ value: valueNum, loadKg: loadNum });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel} />
      <KeyboardAvoidingView
        style={styles.kbWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseSub}>
            {`Unite : ${unitLabel ?? unitToPlaceholder(unit)}`}
          </Text>
          <TextField
            label={`Valeur (${unitLabel ?? unitToPlaceholder(unit)})`}
            value={value}
            onChangeText={(v) => {
              setValue(v);
              setValueError(null);
            }}
            keyboardType="decimal-pad"
            placeholder="0"
            error={valueError ?? undefined}
            autoFocus
          />
          {exercise.lestable && (
            <TextField
              label="Lestage (kg)"
              value={load}
              onChangeText={setLoad}
              keyboardType="decimal-pad"
              placeholder="0"
              hint="0 = poids du corps. Memorise pour le prochain set."
            />
          )}
          <View style={styles.actions}>
            <PrimaryButton
              variant="ghost"
              label="Annuler"
              onPress={onCancel}
              style={styles.cancel}
            />
            <PrimaryButton
              label="Valider"
              onPress={handleSubmit}
              loading={submitting}
              style={styles.confirm}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  kbWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  handleRow: { alignItems: 'center', marginBottom: 12 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border },
  exerciseName: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  exerciseSub: { color: colors.textMuted, fontSize: 12, marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancel: { flex: 1 },
  confirm: { flex: 2 },
});
