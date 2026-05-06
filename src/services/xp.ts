import type { Exercise } from '@/domain/types';

export interface XpInput {
  exercise: Exercise;
  value: number;
  loadKg: number;
  bodyWeightKg: number;
  streakDays?: number;
}

export const STREAK_BONUS_PER_WEEK = 0.05;
export const STREAK_BONUS_CAP = 0.25;

export const streakMultiplier = (streakDays: number | undefined): number => {
  if (!streakDays || streakDays < 7) return 1;
  const weeks = Math.floor(streakDays / 7);
  return 1 + Math.min(weeks * STREAK_BONUS_PER_WEEK, STREAK_BONUS_CAP);
};

export const computeXp = ({
  exercise,
  value,
  loadKg,
  bodyWeightKg,
  streakDays,
}: XpInput): number => {
  if (value <= 0) return 0;
  const safeBw = bodyWeightKg > 0 ? bodyWeightKg : 70;
  const loadMult = exercise.lestable ? 1 + Math.max(0, loadKg) / safeBw : 1;
  const streakMult = streakMultiplier(streakDays);
  const base = exercise.baseXP * value * loadMult * streakMult;
  return Math.round(base * 100) / 100;
};

export const isPersonalRecord = (
  candidateValue: number,
  candidateLoadKg: number,
  bestValue: number | null,
  bestLoadKg: number | null,
): boolean => {
  if (bestValue === null) return candidateValue > 0;
  if (candidateLoadKg > (bestLoadKg ?? 0)) return true;
  if (candidateLoadKg < (bestLoadKg ?? 0)) return false;
  return candidateValue > bestValue;
};
