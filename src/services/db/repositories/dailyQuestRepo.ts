import type { DailyQuestRecord } from '@/domain/types';

import { openDatabase } from '../database';
import { fromBool, newId, toBool } from '../utils';

interface DailyQuestRow {
  id: string;
  date: string;
  hang_completed: number;
  hang_seconds: number;
  hang_load_kg: number;
  calves_completed: number;
  calves_load_kg: number;
  atg_completed: number;
  atg_seconds: number;
  crush_completed: number;
  crush_seconds: number;
  all_completed: number;
  penalty_applied: number;
}

const rowToQuest = (row: DailyQuestRow): DailyQuestRecord => ({
  id: row.id,
  date: row.date,
  hangCompleted: toBool(row.hang_completed),
  hangSeconds: row.hang_seconds,
  hangLoadKg: row.hang_load_kg,
  calvesCompleted: toBool(row.calves_completed),
  calvesLoadKg: row.calves_load_kg,
  atgCompleted: toBool(row.atg_completed),
  atgSeconds: row.atg_seconds,
  crushCompleted: toBool(row.crush_completed),
  crushSeconds: row.crush_seconds,
  allCompleted: toBool(row.all_completed),
  penaltyApplied: toBool(row.penalty_applied),
});

const computeAllCompleted = (q: Omit<DailyQuestRecord, 'allCompleted' | 'id'>): boolean =>
  q.hangCompleted && q.calvesCompleted && q.atgCompleted && q.crushCompleted;

export const dailyQuestRepo = {
  async getByDate(date: string): Promise<DailyQuestRecord | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<DailyQuestRow>(
      'SELECT * FROM daily_quest WHERE date = ?',
      date,
    );
    return row ? rowToQuest(row) : null;
  },

  async upsert(input: Omit<DailyQuestRecord, 'id' | 'allCompleted'> & { id?: string }): Promise<DailyQuestRecord> {
    const db = await openDatabase();
    const allCompleted = computeAllCompleted(input);
    const existing = await db.getFirstAsync<DailyQuestRow>(
      'SELECT id FROM daily_quest WHERE date = ?',
      input.date,
    );

    if (existing) {
      await db.runAsync(
        `UPDATE daily_quest SET
          hang_completed = ?, hang_seconds = ?, hang_load_kg = ?,
          calves_completed = ?, calves_load_kg = ?,
          atg_completed = ?, atg_seconds = ?,
          crush_completed = ?, crush_seconds = ?,
          all_completed = ?, penalty_applied = ?,
          updated_at = datetime('now')
        WHERE date = ?`,
        fromBool(input.hangCompleted),
        input.hangSeconds,
        input.hangLoadKg,
        fromBool(input.calvesCompleted),
        input.calvesLoadKg,
        fromBool(input.atgCompleted),
        input.atgSeconds,
        fromBool(input.crushCompleted),
        input.crushSeconds,
        fromBool(allCompleted),
        fromBool(input.penaltyApplied),
        input.date,
      );
      return { ...input, id: existing.id, allCompleted };
    }

    const id = input.id ?? newId();
    await db.runAsync(
      `INSERT INTO daily_quest (
        id, date,
        hang_completed, hang_seconds, hang_load_kg,
        calves_completed, calves_load_kg,
        atg_completed, atg_seconds,
        crush_completed, crush_seconds,
        all_completed, penalty_applied
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.date,
      fromBool(input.hangCompleted),
      input.hangSeconds,
      input.hangLoadKg,
      fromBool(input.calvesCompleted),
      input.calvesLoadKg,
      fromBool(input.atgCompleted),
      input.atgSeconds,
      fromBool(input.crushCompleted),
      input.crushSeconds,
      fromBool(allCompleted),
      fromBool(input.penaltyApplied),
    );
    return { ...input, id, allCompleted };
  },

  async listLastN(n: number): Promise<readonly DailyQuestRecord[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<DailyQuestRow>(
      'SELECT * FROM daily_quest ORDER BY date DESC LIMIT ?',
      n,
    );
    return rows.map(rowToQuest);
  },

  async listInRange(startDate: string, endDate: string): Promise<readonly DailyQuestRecord[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<DailyQuestRow>(
      'SELECT * FROM daily_quest WHERE date >= ? AND date <= ? ORDER BY date ASC',
      startDate,
      endDate,
    );
    return rows.map(rowToQuest);
  },

  async setPenaltyApplied(date: string, applied: boolean): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      "UPDATE daily_quest SET penalty_applied = ?, updated_at = datetime('now') WHERE date = ?",
      fromBool(applied),
      date,
    );
  },
};
