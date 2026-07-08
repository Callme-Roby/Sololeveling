import { ANKLE_REHAB_EXERCISES, getRehabExercise } from '@/data/rehab/ankleRehab';
import { APP_STATE_KEYS, appStateRepo, validationRepo } from '@/services/db';
import { dayOfWeekIso } from '@/utils/format';

export interface AnklePainEntry {
  date: string;
  pain: number; // 0 (aucune) - 10 (severe)
  note?: string;
}

export const getAnklePainLog = async (): Promise<AnklePainEntry[]> => {
  const log = await appStateRepo.getJson<AnklePainEntry[]>(
    APP_STATE_KEYS.ANKLE_PAIN_LOG,
  );
  return Array.isArray(log) ? log : [];
};

export const logAnklePain = async (
  pain: number,
  note?: string,
  date: string = dayOfWeekIso(),
): Promise<AnklePainEntry[]> => {
  const log = await getAnklePainLog();
  const filtered = log.filter((e) => e.date !== date);
  const next = [...filtered, { date, pain, note }].sort((a, b) =>
    a.date < b.date ? -1 : 1,
  );
  await appStateRepo.setJson(APP_STATE_KEYS.ANKLE_PAIN_LOG, next);
  return next;
};

export interface AnkleSessionInput {
  completedExerciseIds: string[];
  values: Record<string, number>;
  pain: number | null;
  note?: string;
}

/** Enregistre une seance cheville : validations + douleur du jour. */
export const logAnkleSession = async (
  input: AnkleSessionInput,
): Promise<void> => {
  const today = dayOfWeekIso();
  for (const id of input.completedExerciseIds) {
    const ex = getRehabExercise(id);
    if (!ex) continue;
    const value = input.values[id] ?? ex.target ?? 1;
    await validationRepo.insert({
      exerciseId: `ankle_${id}`,
      date: today,
      value,
      unit: ex.unit === 'minutes' ? 'minutes' : ex.unit === 'seconds' ? 'seconds' : 'reps',
      loadKg: 0,
      xpEarned: 0,
      isPersonalRecord: false,
      notes: `Cheville ${ex.name}`,
    });
  }
  if (input.pain !== null) {
    await logAnklePain(input.pain, input.note, today);
  }
};

export const ANKLE_EXERCISES = ANKLE_REHAB_EXERCISES;
