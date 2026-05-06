import type { DailyQuestPlan, ExerciseUnit } from '@/domain/types';

export type QuestKind = 'hang' | 'calves' | 'atg' | 'crush';

export interface QuestTarget {
  kind: QuestKind;
  label: string;
  exerciseId: string;
  unit: ExerciseUnit;
  unitLabel: string;
  defaultValue: number;
  questCompletedField: 'hangCompleted' | 'calvesCompleted' | 'atgCompleted' | 'crushCompleted';
  questValueField?: 'hangSeconds' | 'atgSeconds' | 'crushSeconds';
  questLoadField?: 'hangLoadKg' | 'calvesLoadKg';
}

export const questTargetForKind = (
  kind: QuestKind,
  plan: DailyQuestPlan,
): QuestTarget => {
  switch (kind) {
    case 'hang': {
      return {
        kind,
        label: 'Hang barre',
        exerciseId: 'hang_passive',
        unit: 'seconds',
        unitLabel: 'secondes cumulees',
        defaultValue: plan.hangSecondsTarget,
        questCompletedField: 'hangCompleted',
        questValueField: 'hangSeconds',
        questLoadField: 'hangLoadKg',
      };
    }
    case 'calves': {
      const exerciseId = plan.calvesDeficit
        ? 'calf_raise_deficit'
        : plan.calvesUnilateral
          ? 'calf_raise_unilateral'
          : 'calf_raise_bilateral';
      return {
        kind,
        label: 'Mollets / Tibialis',
        exerciseId,
        unit: 'reps',
        unitLabel: 'reps cumulees',
        defaultValue: plan.calvesPerSet * plan.calvesSets,
        questCompletedField: 'calvesCompleted',
        questLoadField: 'calvesLoadKg',
      };
    }
    case 'atg': {
      return {
        kind,
        label: 'ATG hold',
        exerciseId: 'atg_hold',
        unit: 'seconds',
        unitLabel: 'secondes',
        defaultValue: plan.atgHoldSeconds,
        questCompletedField: 'atgCompleted',
        questValueField: 'atgSeconds',
      };
    }
    case 'crush': {
      const exerciseId =
        plan.crushVariant === 'tennis_ball'
          ? 'crush_tennis_ball'
          : plan.crushVariant === 'hard_ball_or_towel'
            ? 'crush_hard_ball'
            : 'crush_gripper';
      return {
        kind,
        label: 'Crush du jour',
        exerciseId,
        unit: 'seconds',
        unitLabel: 'secondes cumulees',
        defaultValue: plan.crushSecondsPerHand * plan.crushSets * 2,
        questCompletedField: 'crushCompleted',
        questValueField: 'crushSeconds',
      };
    }
  }
};
