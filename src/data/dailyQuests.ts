import type { DailyQuestPlan } from '@/domain/types';

export const DAILY_QUESTS_BY_PHASE: Record<1 | 2 | 3, DailyQuestPlan> = {
  1: {
    phase: 1,
    hangSecondsTarget: 90,
    hangSets: 3,
    hangLoadKgHint: 0,
    calvesPerSet: 25,
    calvesSets: 2,
    calvesUnilateral: false,
    calvesDeficit: false,
    tibialisPerSet: 25,
    tibialisSets: 2,
    atgHoldSeconds: 45,
    atgPausedReps: 0,
    crushSecondsPerHand: 30,
    crushSets: 3,
    crushVariant: 'tennis_ball',
  },
  2: {
    phase: 2,
    hangSecondsTarget: 150,
    hangSets: 3,
    hangLoadKgHint: 5,
    calvesPerSet: 25,
    calvesSets: 3,
    calvesUnilateral: true,
    calvesDeficit: false,
    tibialisPerSet: 25,
    tibialisSets: 3,
    atgHoldSeconds: 75,
    atgPausedReps: 0,
    crushSecondsPerHand: 30,
    crushSets: 3,
    crushVariant: 'hard_ball_or_towel',
  },
  3: {
    phase: 3,
    hangSecondsTarget: 240,
    hangSets: 3,
    hangLoadKgHint: 12,
    calvesPerSet: 25,
    calvesSets: 3,
    calvesUnilateral: true,
    calvesDeficit: true,
    tibialisPerSet: 25,
    tibialisSets: 3,
    atgHoldSeconds: 105,
    atgPausedReps: 5,
    crushSecondsPerHand: 30,
    crushSets: 3,
    crushVariant: 'gripper_or_fruit',
  },
};

export const phaseForWeek = (weekNumber: number): 1 | 2 | 3 => {
  if (weekNumber <= 4) return 1;
  if (weekNumber <= 8) return 2;
  return 3;
};
