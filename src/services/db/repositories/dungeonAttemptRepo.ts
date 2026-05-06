import type { DungeonAttempt } from '@/domain/types';

import { openDatabase } from '../database';
import { fromBool, newId, toBool } from '../utils';

interface DungeonAttemptRow {
  id: string;
  dungeon_id: string;
  date: string;
  marker_values_json: string;
  stars_achieved: number;
  completed: number;
  duration_seconds: number | null;
  notes: string | null;
}

const rowToAttempt = (row: DungeonAttemptRow): DungeonAttempt => ({
  id: row.id,
  dungeonId: row.dungeon_id,
  date: row.date,
  markerValues: JSON.parse(row.marker_values_json) as Record<string, number>,
  starsAchieved: row.stars_achieved as 0 | 1 | 2 | 3,
  completed: toBool(row.completed),
  durationSeconds: row.duration_seconds ?? undefined,
  notes: row.notes ?? undefined,
});

export const dungeonAttemptRepo = {
  async insert(input: Omit<DungeonAttempt, 'id'>): Promise<DungeonAttempt> {
    const db = await openDatabase();
    const id = newId();
    await db.runAsync(
      `INSERT INTO dungeon_attempt (
        id, dungeon_id, date, marker_values_json, stars_achieved,
        completed, duration_seconds, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.dungeonId,
      input.date,
      JSON.stringify(input.markerValues),
      input.starsAchieved,
      fromBool(input.completed),
      input.durationSeconds ?? null,
      input.notes ?? null,
    );
    return { ...input, id };
  },

  async getLatestForDungeon(dungeonId: string): Promise<DungeonAttempt | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<DungeonAttemptRow>(
      `SELECT * FROM dungeon_attempt
       WHERE dungeon_id = ?
       ORDER BY date DESC, created_at DESC
       LIMIT 1`,
      dungeonId,
    );
    return row ? rowToAttempt(row) : null;
  },

  async listForDungeon(dungeonId: string): Promise<readonly DungeonAttempt[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<DungeonAttemptRow>(
      'SELECT * FROM dungeon_attempt WHERE dungeon_id = ? ORDER BY date DESC',
      dungeonId,
    );
    return rows.map(rowToAttempt);
  },

  async listAll(): Promise<readonly DungeonAttempt[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<DungeonAttemptRow>(
      'SELECT * FROM dungeon_attempt ORDER BY date DESC',
    );
    return rows.map(rowToAttempt);
  },
};
