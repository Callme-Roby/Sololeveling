import { openDatabase } from '../database';

interface AppStateRow {
  key: string;
  value: string;
}

export const appStateRepo = {
  async get(key: string): Promise<string | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<AppStateRow>(
      'SELECT value FROM app_state WHERE key = ?',
      key,
    );
    return row?.value ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO app_state (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      key,
      value,
    );
  },

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJson<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  },

  async delete(key: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM app_state WHERE key = ?', key);
  },
};

export const APP_STATE_KEYS = {
  LAST_QUEST_CHECK_DATE: 'last_quest_check_date',
  LAST_D6_ROLL_WEEK: 'last_d6_roll_week',
  LAST_WEATHER_CHECK_AT: 'last_weather_check_at',
  CONSECUTIVE_PENALTIES: 'consecutive_penalties',
  LESTAGE_MEMORY: 'lestage_memory',
  ALARM_CONFIG: 'alarm_config',
  LAST_MORNING_MISSION_DATE: 'last_morning_mission_date',
  CALISTHENICS_STATE: 'calisthenics_state',
  ANKLE_PAIN_LOG: 'ankle_pain_log',
} as const;
