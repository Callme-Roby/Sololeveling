import type { Title } from '@/domain/types';

import { openDatabase } from '../database';
import { newId } from '../utils';

interface TitleRow {
  id: string;
  name: string;
  source: string;
  unlocked_at: string;
  dungeon_id: string | null;
}

const rowToTitle = (row: TitleRow): Title => ({
  id: row.id,
  name: row.name,
  source: row.source as Title['source'],
  unlockedAt: row.unlocked_at,
  dungeonId: row.dungeon_id ?? undefined,
});

export const titleRepo = {
  async unlock(input: Omit<Title, 'id'>): Promise<Title> {
    const db = await openDatabase();
    const existing = await db.getFirstAsync<TitleRow>(
      'SELECT * FROM title WHERE name = ? LIMIT 1',
      input.name,
    );
    if (existing) {
      return rowToTitle(existing);
    }
    const id = newId();
    await db.runAsync(
      `INSERT INTO title (id, name, source, unlocked_at, dungeon_id)
       VALUES (?, ?, ?, ?, ?)`,
      id,
      input.name,
      input.source,
      input.unlockedAt,
      input.dungeonId ?? null,
    );
    return { ...input, id };
  },

  async list(): Promise<readonly Title[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<TitleRow>(
      'SELECT * FROM title ORDER BY unlocked_at DESC',
    );
    return rows.map(rowToTitle);
  },

  async hasName(name: string): Promise<boolean> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<{ c: number }>(
      'SELECT COUNT(*) as c FROM title WHERE name = ?',
      name,
    );
    return (row?.c ?? 0) > 0;
  },
};
