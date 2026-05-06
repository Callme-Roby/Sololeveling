import { EXERCISES_BY_ID } from '@/data/exercises';
import type { Stat, Validation } from '@/domain/types';

export const RANK_THRESHOLDS: Record<string, number> = {
  E: 0,
  D: 250,
  C: 750,
  B: 1750,
  A: 3500,
  S: 7000,
};

export const sumXpByStat = (
  validations: readonly Validation[],
): Record<Stat, number> => {
  const totals: Record<Stat, number> = { VIT: 0, AGI: 0, STR: 0, GRP: 0 };
  for (const v of validations) {
    const ex = EXERCISES_BY_ID[v.exerciseId];
    if (!ex) continue;
    totals[ex.category] += v.xpEarned;
  }
  return totals;
};

export const levelFromXp = (xp: number): number => {
  if (xp <= 0) return 0;
  return Math.floor(Math.sqrt(xp / 5));
};

export const xpForLevel = (level: number): number => 5 * level * level;

export const progressInLevel = (xp: number): number => {
  const lvl = levelFromXp(xp);
  const start = xpForLevel(lvl);
  const end = xpForLevel(lvl + 1);
  if (end === start) return 0;
  return Math.max(0, Math.min(1, (xp - start) / (end - start)));
};
