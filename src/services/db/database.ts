import * as SQLite from 'expo-sqlite';

import { LATEST_VERSION, MIGRATIONS } from './migrations';

const DB_NAME = 'sololeveling.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let openPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const readVersion = async (
  db: SQLite.SQLiteDatabase,
): Promise<number> => {
  try {
    const row = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_meta LIMIT 1',
    );
    return row?.version ?? 0;
  } catch {
    return 0;
  }
};

const applyMigrations = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const current = await readVersion(db);
  const pending = MIGRATIONS.filter((m) => m.version > current);
  if (pending.length === 0) return;

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.up);
      const exists = await db.getFirstAsync<{ c: number }>(
        'SELECT COUNT(*) as c FROM schema_meta',
      );
      if ((exists?.c ?? 0) === 0) {
        await db.runAsync(
          'INSERT INTO schema_meta (version) VALUES (?)',
          migration.version,
        );
      } else {
        await db.runAsync(
          'UPDATE schema_meta SET version = ?',
          migration.version,
        );
      }
    });
  }
};

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) return dbInstance;
  if (openPromise) return openPromise;

  openPromise = (async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await applyMigrations(db);
    dbInstance = db;
    return db;
  })();

  try {
    return await openPromise;
  } finally {
    openPromise = null;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!dbInstance) {
    throw new Error('Database not opened yet. Call openDatabase() first.');
  }
  return dbInstance;
};

export const closeDatabase = async (): Promise<void> => {
  if (!dbInstance) return;
  await dbInstance.closeAsync();
  dbInstance = null;
};

export const resetDatabase = async (): Promise<void> => {
  await closeDatabase();
  await SQLite.deleteDatabaseAsync(DB_NAME);
};

export const getSchemaVersion = async (): Promise<number> => {
  const db = await openDatabase();
  return readVersion(db);
};

export const LATEST_SCHEMA_VERSION = LATEST_VERSION;
