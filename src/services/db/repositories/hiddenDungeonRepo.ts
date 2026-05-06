import type { HiddenDungeonInstance, HiddenDungeonState, KeyMission, Phase } from '@/domain/types';

import { openDatabase } from '../database';
import { fromBool, newId, toBool } from '../utils';

interface HiddenDungeonRow {
  id: string;
  dungeon_id: string;
  state: string;
  appeared_at: string | null;
  key_deadline: string | null;
  attempted_at: string | null;
  succeeded_at: string | null;
  invoked_freely: number;
  phase: number | null;
  key_missions_json: string;
}

const rowToInstance = (row: HiddenDungeonRow): HiddenDungeonInstance & { invokedFreely: boolean; phase?: Phase } => ({
  id: row.id,
  dungeonId: row.dungeon_id,
  state: row.state as HiddenDungeonState,
  appearedAt: row.appeared_at ?? undefined,
  keyDeadline: row.key_deadline ?? undefined,
  attemptedAt: row.attempted_at ?? undefined,
  succeededAt: row.succeeded_at ?? undefined,
  invokedFreely: toBool(row.invoked_freely),
  phase: row.phase as Phase | undefined,
  keyMissions: JSON.parse(row.key_missions_json) as KeyMission[],
});

export const hiddenDungeonRepo = {
  async create(input: {
    dungeonId: string;
    state: HiddenDungeonState;
    appearedAt?: string;
    keyDeadline?: string;
    invokedFreely: boolean;
    phase?: Phase;
    keyMissions: KeyMission[];
  }): Promise<HiddenDungeonInstance & { invokedFreely: boolean; phase?: Phase }> {
    const db = await openDatabase();
    const id = newId();
    await db.runAsync(
      `INSERT INTO hidden_dungeon_instance (
        id, dungeon_id, state, appeared_at, key_deadline,
        invoked_freely, phase, key_missions_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.dungeonId,
      input.state,
      input.appearedAt ?? null,
      input.keyDeadline ?? null,
      fromBool(input.invokedFreely),
      input.phase ?? null,
      JSON.stringify(input.keyMissions),
    );
    return {
      id,
      dungeonId: input.dungeonId,
      state: input.state,
      appearedAt: input.appearedAt,
      keyDeadline: input.keyDeadline,
      attemptedAt: undefined,
      succeededAt: undefined,
      invokedFreely: input.invokedFreely,
      phase: input.phase,
      keyMissions: input.keyMissions,
    };
  },

  async getById(id: string): Promise<(HiddenDungeonInstance & { invokedFreely: boolean; phase?: Phase }) | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<HiddenDungeonRow>(
      'SELECT * FROM hidden_dungeon_instance WHERE id = ?',
      id,
    );
    return row ? rowToInstance(row) : null;
  },

  async listByState(state: HiddenDungeonState): Promise<readonly (HiddenDungeonInstance & { invokedFreely: boolean; phase?: Phase })[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<HiddenDungeonRow>(
      'SELECT * FROM hidden_dungeon_instance WHERE state = ? ORDER BY created_at DESC',
      state,
    );
    return rows.map(rowToInstance);
  },

  async listActive(): Promise<readonly (HiddenDungeonInstance & { invokedFreely: boolean; phase?: Phase })[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<HiddenDungeonRow>(
      "SELECT * FROM hidden_dungeon_instance WHERE state IN ('apparu', 'cleAcquise') ORDER BY created_at DESC",
    );
    return rows.map(rowToInstance);
  },

  async getActiveForDungeon(dungeonId: string): Promise<(HiddenDungeonInstance & { invokedFreely: boolean; phase?: Phase }) | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<HiddenDungeonRow>(
      `SELECT * FROM hidden_dungeon_instance
       WHERE dungeon_id = ? AND state IN ('apparu', 'cleAcquise')
       ORDER BY created_at DESC
       LIMIT 1`,
      dungeonId,
    );
    return row ? rowToInstance(row) : null;
  },

  async setState(id: string, state: HiddenDungeonState): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      'UPDATE hidden_dungeon_instance SET state = ? WHERE id = ?',
      state,
      id,
    );
  },

  async updateKeyMissions(id: string, missions: KeyMission[]): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      'UPDATE hidden_dungeon_instance SET key_missions_json = ? WHERE id = ?',
      JSON.stringify(missions),
      id,
    );
  },

  async markAttempted(id: string, succeeded: boolean): Promise<void> {
    const db = await openDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE hidden_dungeon_instance
       SET state = ?, attempted_at = ?, succeeded_at = ?
       WHERE id = ?`,
      succeeded ? 'reussi' : 'echoue',
      now,
      succeeded ? now : null,
      id,
    );
  },

  async expireOverdue(now: Date = new Date()): Promise<number> {
    const db = await openDatabase();
    const nowIso = now.toISOString();
    const result = await db.runAsync(
      `UPDATE hidden_dungeon_instance
       SET state = 'expire'
       WHERE state = 'apparu' AND key_deadline IS NOT NULL AND key_deadline < ?`,
      nowIso,
    );
    return result.changes ?? 0;
  },
};
