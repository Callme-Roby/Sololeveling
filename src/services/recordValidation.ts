import { getExercise } from '@/data/exercises';
import type { ExerciseUnit, Validation } from '@/domain/types';
import { validationRepo } from '@/services/db';
import { computeXp, isPersonalRecord } from '@/services/xp';
import { dayOfWeekIso } from '@/utils/format';

import { rememberLoad } from './lestageMemory';

export interface RecordValidationInput {
  exerciseId: string;
  value: number;
  unit: ExerciseUnit;
  loadKg: number;
  bodyWeightKg: number;
  streakDays: number;
  workoutId?: string;
  notes?: string;
  date?: string;
}

export interface RecordValidationOutput {
  validation: Validation;
  xpEarned: number;
  isPersonalRecord: boolean;
}

export const recordValidation = async (
  input: RecordValidationInput,
): Promise<RecordValidationOutput> => {
  const exercise = getExercise(input.exerciseId);
  if (!exercise) {
    throw new Error(`Unknown exercise: ${input.exerciseId}`);
  }

  const xpEarned = computeXp({
    exercise,
    value: input.value,
    loadKg: input.loadKg,
    bodyWeightKg: input.bodyWeightKg,
    streakDays: input.streakDays,
  });

  const previousBest = await validationRepo.getBestForExercise(exercise.id);
  const pr = isPersonalRecord(
    input.value,
    input.loadKg,
    previousBest?.value ?? null,
    previousBest?.loadKg ?? null,
  );

  const validation = await validationRepo.insert({
    exerciseId: exercise.id,
    workoutId: input.workoutId,
    date: input.date ?? dayOfWeekIso(),
    value: input.value,
    unit: input.unit,
    loadKg: input.loadKg,
    xpEarned,
    isPersonalRecord: pr,
    notes: input.notes,
  });

  if (exercise.lestable && input.loadKg > 0) {
    await rememberLoad(exercise.id, input.loadKg);
  }

  return { validation, xpEarned, isPersonalRecord: pr };
};
