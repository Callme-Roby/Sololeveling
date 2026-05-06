export interface Migration {
  version: number;
  up: string;
}

export const MIGRATIONS: readonly Migration[] = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS schema_meta (
        version INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        body_weight_kg REAL NOT NULL,
        home_lat REAL NOT NULL,
        home_lng REAL NOT NULL,
        home_radius_km INTEGER NOT NULL DEFAULT 50,
        rank TEXT NOT NULL DEFAULT 'E',
        streak_days INTEGER NOT NULL DEFAULT 0,
        start_date TEXT NOT NULL,
        baselines_completed INTEGER NOT NULL DEFAULT 0,
        free_invocations_used_p1 INTEGER NOT NULL DEFAULT 0,
        free_invocations_used_p2 INTEGER NOT NULL DEFAULT 0,
        free_invocations_used_p3 INTEGER NOT NULL DEFAULT 0,
        notifications_enabled INTEGER NOT NULL DEFAULT 0,
        weather_enabled INTEGER NOT NULL DEFAULT 0,
        background_location_enabled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS baseline (
        user_id TEXT PRIMARY KEY,
        one_km_time_sec INTEGER,
        burpees_5min_reps INTEGER,
        broad_jump_cm INTEGER,
        sprint_30m_sec REAL,
        box_jump_height_cm INTEGER,
        calf_raises_left INTEGER,
        calf_raises_right INTEGER,
        atg_hold_left_sec INTEGER,
        atg_hold_right_sec INTEGER,
        balance_eyes_closed_left_sec INTEGER,
        balance_eyes_closed_right_sec INTEGER,
        dead_hang_max_sec INTEGER,
        tennis_ball_left_sec INTEGER,
        tennis_ball_right_sec INTEGER,
        farmer_carry_distance_m INTEGER,
        energy INTEGER,
        sleep INTEGER,
        motivation INTEGER,
        pain INTEGER,
        taken_at TEXT NOT NULL,
        partial INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS daily_quest (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL UNIQUE,
        hang_completed INTEGER NOT NULL DEFAULT 0,
        hang_seconds INTEGER NOT NULL DEFAULT 0,
        hang_load_kg REAL NOT NULL DEFAULT 0,
        calves_completed INTEGER NOT NULL DEFAULT 0,
        calves_load_kg REAL NOT NULL DEFAULT 0,
        atg_completed INTEGER NOT NULL DEFAULT 0,
        atg_seconds INTEGER NOT NULL DEFAULT 0,
        crush_completed INTEGER NOT NULL DEFAULT 0,
        crush_seconds INTEGER NOT NULL DEFAULT 0,
        all_completed INTEGER NOT NULL DEFAULT 0,
        penalty_applied INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_daily_quest_date ON daily_quest(date);

      CREATE TABLE IF NOT EXISTS validation (
        id TEXT PRIMARY KEY,
        exercise_id TEXT NOT NULL,
        workout_id TEXT,
        date TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        load_kg REAL NOT NULL DEFAULT 0,
        xp_earned REAL NOT NULL,
        is_personal_record INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_validation_date ON validation(date);
      CREATE INDEX IF NOT EXISTS idx_validation_exercise ON validation(exercise_id);
      CREATE INDEX IF NOT EXISTS idx_validation_workout ON validation(workout_id);

      CREATE TABLE IF NOT EXISTS dungeon_attempt (
        id TEXT PRIMARY KEY,
        dungeon_id TEXT NOT NULL,
        date TEXT NOT NULL,
        marker_values_json TEXT NOT NULL,
        stars_achieved INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        duration_seconds INTEGER,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_dungeon_attempt ON dungeon_attempt(dungeon_id, date);

      CREATE TABLE IF NOT EXISTS hidden_dungeon_instance (
        id TEXT PRIMARY KEY,
        dungeon_id TEXT NOT NULL,
        state TEXT NOT NULL,
        appeared_at TEXT,
        key_deadline TEXT,
        attempted_at TEXT,
        succeeded_at TEXT,
        invoked_freely INTEGER NOT NULL DEFAULT 0,
        phase INTEGER,
        key_missions_json TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_hidden_dungeon_state ON hidden_dungeon_instance(state);

      CREATE TABLE IF NOT EXISTS title (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source TEXT NOT NULL,
        unlocked_at TEXT NOT NULL,
        dungeon_id TEXT
      );

      CREATE TABLE IF NOT EXISTS gps_track (
        id TEXT PRIMARY KEY,
        started_at TEXT NOT NULL,
        ended_at TEXT NOT NULL,
        distance_meters REAL NOT NULL,
        duration_seconds INTEGER NOT NULL,
        average_pace_sec_per_km REAL,
        max_speed_mps REAL,
        elevation_gain_meters REAL,
        points_json TEXT NOT NULL,
        workout_id TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_gps_track_started ON gps_track(started_at);

      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `,
  },
  {
    version: 2,
    up: `
      ALTER TABLE user_profile ADD COLUMN must_redo_from_week INTEGER;
    `,
  },
];

export const LATEST_VERSION = MIGRATIONS[MIGRATIONS.length - 1]?.version ?? 0;
