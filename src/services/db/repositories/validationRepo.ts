import type { ExerciseUnit, Validation } from '@/domain/types';

import { openDatabase } from '../database';
import { fromBool, newId, toBool } from '../utils';

interface ValidationRow {
  id: string;
  exercise_id: string;
  workout_id: string | null;
  date: string;
  value: number;
  unit: string;
  load_kg: number;
  xp_earned: number;
  is_personal_record: number;
  notes: string | null;
}

const rowToValidation = (row: ValidationRow): Validation => ({
  id: row.id,
  exerciseId: row.exercise_id,
  workoutId: row.workout_id ?? undefined,
  date: row.date,
  value: row.value,
  unit: row.unit as ExerciseUnit,
  loadKg: row.load_kg,
  xpEarned: row.xp_earned,
  isPersonalRecord: toBool(row.is_personal_record),
  notes: row.notes ?? undefined,
});

export const validationRepo = {
  async insert(input: Omit<Validation, 'id'>): Promise<Validation> {
    const db = await openDatabase();
    const id = newId();
    await db.runAsync(
      `INSERT INTO validation (
        id, exercise_id, workout_id, date, value, unit,
        load_kg, xp_earned, is_personal_record, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.exerciseId,
      input.workoutId ?? null,
      input.date,
      input.value,
      input.unit,
      input.loadKg,
      input.xpEarned,
      fromBool(input.isPersonalRecord),
      input.notes ?? null,
    );
    return { ...input, id };
  },

  async listByDate(date: string): Promise<readonly Validation[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<ValidationRow>(
      'SELECT * FROM validation WHERE date = ? ORDER BY created_at ASC',
      date,
    );
    return rows.map(rowToValidation);
  },

  async listByWorkout(workoutId: string): Promise<readonly Validation[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<ValidationRow>(
      'SELECT * FROM validation WHERE workout_id = ? ORDER BY created_at ASC',
      workoutId,
    );
    return rows.map(rowToValidation);
  },

  async listByExercise(
    exerciseId: string,
    limit = 100,
  ): Promise<readonly Validation[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<ValidationRow>(
      'SELECT * FROM validation WHERE exercise_id = ? ORDER BY date DESC, created_at DESC LIMIT ?',
      exerciseId,
      limit,
    );
    return rows.map(rowToValidation);
  },

  async getBestForExercise(exerciseId: string): Promise<Validation | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<ValidationRow>(
      `SELECT * FROM validation
       WHERE exercise_id = ?
       ORDER BY xp_earned DESC, value DESC
       LIMIT 1`,
      exerciseId,
    );
    return row ? rowToValidation(row) : null;
  },

  async sumXpByStat(): Promise<Record<string, number>> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<{ exercise_id: string; xp_earned: number }>(
      'SELECT exercise_id, xp_earned FROM validation',
    );
    const sums: Record<string, number> = {};
    for (const row of rows) {
      sums[row.exercise_id] = (sums[row.exercise_id] ?? 0) + row.xp_earned;
    }
    return sums;
  },

  async listAll(): Promise<readonly Validation[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<ValidationRow>(
      'SELECT * FROM validation ORDER BY date DESC, created_at DESC',
    );
    return rows.map(rowToValidation);
  },
};
