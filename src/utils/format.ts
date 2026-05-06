import type { Exercise, PlannedExercise, WorkoutType } from '@/domain/types';

export const dayNames: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string>> = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
  7: 'Dimanche',
};

export const todayDayOfWeek = (now: Date = new Date()): 1 | 2 | 3 | 4 | 5 | 6 | 7 => {
  const js = now.getDay();
  return (((js + 6) % 7) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

export const dayOfWeekIso = (now: Date = new Date()): string => {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const workoutTypeLabels: Record<WorkoutType, string> = {
  AGI_GRP: 'AGI + GRP',
  VIT_Z2: 'VIT (zone 2)',
  STR_GRP: 'STR + GRP',
  HIIT: 'HIIT',
  AGI_STR: 'AGI + STR',
  BOSS: 'Donjon Hebdo',
  REST: 'Recup',
};

export const labelForWorkoutType = (t: WorkoutType): string => workoutTypeLabels[t];

export const formatPlannedExercise = (
  planned: PlannedExercise,
  exercise: Exercise | undefined,
): string => {
  const name = exercise?.name ?? planned.exerciseId;
  const parts: string[] = [];

  if (planned.sets && planned.repsPerSet) {
    parts.push(`${planned.sets} x ${planned.repsPerSet}${planned.perSide ? '/cote' : ''}`);
  } else if (planned.sets && planned.durationSecPerSet) {
    parts.push(`${planned.sets} x ${planned.durationSecPerSet}s${planned.perSide ? '/cote' : ''}`);
  } else if (planned.sets && planned.distanceMPerSet) {
    parts.push(`${planned.sets} x ${planned.distanceMPerSet}m`);
  } else if (planned.sets) {
    parts.push(`${planned.sets} series`);
  }

  if (planned.totalDurationMin) parts.push(`${planned.totalDurationMin} min`);
  if (planned.totalReps) parts.push(`${planned.totalReps} reps`);

  const head = parts.length > 0 ? `${name} ${parts.join(' ')}` : name;
  return planned.notes ? `${head} - ${planned.notes}` : head;
};
