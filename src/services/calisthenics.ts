import {
  applyCompletion,
  buildMission,
  defaultCalState,
  normalizeCalState,
  statTotalsFromState,
  type CalMission,
  type CalState,
  type CalStatTotals,
} from '@/data/calisthenics/progression';
import type { MovementPattern } from '@/data/calisthenics/catalog';
import { APP_STATE_KEYS, appStateRepo } from '@/services/db';

export const loadCalState = async (): Promise<CalState> => {
  const raw = await appStateRepo.getJson<CalState>(
    APP_STATE_KEYS.CALISTHENICS_STATE,
  );
  return normalizeCalState(raw);
};

export const saveCalState = async (state: CalState): Promise<void> => {
  await appStateRepo.setJson(APP_STATE_KEYS.CALISTHENICS_STATE, state);
};

export const getCalMission = async (): Promise<{
  state: CalState;
  mission: CalMission;
  totals: CalStatTotals;
}> => {
  const state = await loadCalState();
  return {
    state,
    mission: buildMission(state),
    totals: statTotalsFromState(state),
  };
};

/** Cloture une seance : applique la progression sur les patterns reussis. */
export const completeCalSession = async (
  completedPatterns: MovementPattern[],
  sessionDate: string,
): Promise<CalState> => {
  const state = await loadCalState();
  const next = applyCompletion(state, completedPatterns, sessionDate);
  await saveCalState(next);
  return next;
};

export const resetCalState = async (): Promise<CalState> => {
  const fresh = defaultCalState();
  await saveCalState(fresh);
  return fresh;
};
