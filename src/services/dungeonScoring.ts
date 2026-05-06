import type { DungeonAttempt, WeeklyDungeon } from '@/domain/types';

export interface ScoreInputs {
  dungeon: WeeklyDungeon;
  markerValues: Record<string, number>;
  previousAttempt: DungeonAttempt | null;
  streakDays: number;
  weekQuestsCompletedCount: number;
  totalQuestsThisWeek?: number;
  abandoned?: boolean;
}

export interface ScoreOutput {
  stars: 0 | 1 | 2 | 3;
  rawScore: number;
  discipline: number;
  streakBonus: number;
  final: number;
  improvedMarkers: number;
  totalMarkers: number;
}

export const STAR_TWO_THRESHOLD = 0.55;
export const STAR_THREE_THRESHOLD = 0.85;

export const W1_DISCIPLINE_TWO_STARS = 0.7;
export const W1_DISCIPLINE_THREE_STARS = 0.9;

const isImproved = (
  current: number,
  previous: number | undefined,
  betterIsLower: boolean,
): boolean => {
  if (previous === undefined) return current > 0;
  return betterIsLower ? current < previous : current > previous;
};

export const scoreDungeon = (input: ScoreInputs): ScoreOutput => {
  const { dungeon, markerValues, previousAttempt, streakDays, weekQuestsCompletedCount } = input;
  const totalQuestsThisWeek = input.totalQuestsThisWeek ?? 28;

  const totalMarkers = dungeon.protocol.length;

  if (input.abandoned) {
    return {
      stars: 0,
      rawScore: 0,
      discipline: 0,
      streakBonus: 0,
      final: 0,
      improvedMarkers: 0,
      totalMarkers,
    };
  }

  const allFilled = dungeon.protocol.every(
    (m) => Number.isFinite(markerValues[m.id]) && (markerValues[m.id] ?? 0) > 0,
  );

  let improvedMarkers = 0;
  for (const m of dungeon.protocol) {
    const current = markerValues[m.id];
    if (current === undefined) continue;
    const prev = previousAttempt?.markerValues[m.id];
    if (isImproved(current, prev, m.betterIsLower)) improvedMarkers++;
  }

  const rawScore = totalMarkers > 0 ? improvedMarkers / totalMarkers : 0;
  const streakBonus = Math.min(1, streakDays / 28);
  const discipline =
    totalQuestsThisWeek > 0
      ? Math.min(1, weekQuestsCompletedCount / totalQuestsThisWeek)
      : 0;

  if (dungeon.weekNumber === 1) {
    if (!allFilled) {
      return {
        stars: 0,
        rawScore,
        discipline,
        streakBonus,
        final: 0,
        improvedMarkers,
        totalMarkers,
      };
    }
    let stars: 0 | 1 | 2 | 3 = 1;
    if (discipline >= W1_DISCIPLINE_THREE_STARS) stars = 3;
    else if (discipline >= W1_DISCIPLINE_TWO_STARS) stars = 2;
    return {
      stars,
      rawScore,
      discipline,
      streakBonus,
      final: discipline,
      improvedMarkers,
      totalMarkers,
    };
  }

  const final = 0.6 * rawScore + 0.25 * discipline + 0.15 * streakBonus;

  let stars: 0 | 1 | 2 | 3;
  if (!allFilled) stars = 0;
  else if (final >= STAR_THREE_THRESHOLD) stars = 3;
  else if (final >= STAR_TWO_THRESHOLD) stars = 2;
  else stars = 1;

  return { stars, rawScore, discipline, streakBonus, final, improvedMarkers, totalMarkers };
};
