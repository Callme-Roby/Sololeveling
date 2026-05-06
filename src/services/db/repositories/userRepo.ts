import type { Phase, Rank, UserProfile } from '@/domain/types';

import { openDatabase } from '../database';
import { fromBool, newId, toBool } from '../utils';

interface UserProfileRow {
  id: string;
  name: string;
  body_weight_kg: number;
  home_lat: number;
  home_lng: number;
  home_radius_km: number;
  rank: string;
  streak_days: number;
  start_date: string;
  baselines_completed: number;
  free_invocations_used_p1: number;
  free_invocations_used_p2: number;
  free_invocations_used_p3: number;
  notifications_enabled: number;
  weather_enabled: number;
  background_location_enabled: number;
  must_redo_from_week: number | null;
}

const rowToProfile = (row: UserProfileRow): UserProfile => ({
  id: row.id,
  name: row.name,
  bodyWeightKg: row.body_weight_kg,
  homeLat: row.home_lat,
  homeLng: row.home_lng,
  homeRadiusKm: row.home_radius_km as 30 | 50 | 100,
  rank: row.rank as Rank,
  streakDays: row.streak_days,
  startDate: row.start_date,
  baselinesCompleted: toBool(row.baselines_completed),
  freeInvocationsUsedByPhase: {
    1: row.free_invocations_used_p1,
    2: row.free_invocations_used_p2,
    3: row.free_invocations_used_p3,
  },
  notificationsEnabled: toBool(row.notifications_enabled),
  weatherEnabled: toBool(row.weather_enabled),
  backgroundLocationEnabled: toBool(row.background_location_enabled),
  mustRedoFromWeek: row.must_redo_from_week,
});

export const userRepo = {
  async getCurrent(): Promise<UserProfile | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<UserProfileRow>(
      'SELECT * FROM user_profile LIMIT 1',
    );
    return row ? rowToProfile(row) : null;
  },

  async create(input: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const db = await openDatabase();
    const id = newId();
    await db.runAsync(
      `INSERT INTO user_profile (
        id, name, body_weight_kg, home_lat, home_lng, home_radius_km,
        rank, streak_days, start_date, baselines_completed,
        free_invocations_used_p1, free_invocations_used_p2, free_invocations_used_p3,
        notifications_enabled, weather_enabled, background_location_enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.name,
      input.bodyWeightKg,
      input.homeLat,
      input.homeLng,
      input.homeRadiusKm,
      input.rank,
      input.streakDays,
      input.startDate,
      fromBool(input.baselinesCompleted),
      input.freeInvocationsUsedByPhase[1],
      input.freeInvocationsUsedByPhase[2],
      input.freeInvocationsUsedByPhase[3],
      fromBool(input.notificationsEnabled),
      fromBool(input.weatherEnabled),
      fromBool(input.backgroundLocationEnabled),
    );
    return { ...input, id };
  },

  async update(profile: UserProfile): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE user_profile SET
        name = ?, body_weight_kg = ?, home_lat = ?, home_lng = ?, home_radius_km = ?,
        rank = ?, streak_days = ?, baselines_completed = ?,
        free_invocations_used_p1 = ?, free_invocations_used_p2 = ?, free_invocations_used_p3 = ?,
        notifications_enabled = ?, weather_enabled = ?, background_location_enabled = ?,
        updated_at = datetime('now')
      WHERE id = ?`,
      profile.name,
      profile.bodyWeightKg,
      profile.homeLat,
      profile.homeLng,
      profile.homeRadiusKm,
      profile.rank,
      profile.streakDays,
      fromBool(profile.baselinesCompleted),
      profile.freeInvocationsUsedByPhase[1],
      profile.freeInvocationsUsedByPhase[2],
      profile.freeInvocationsUsedByPhase[3],
      fromBool(profile.notificationsEnabled),
      fromBool(profile.weatherEnabled),
      fromBool(profile.backgroundLocationEnabled),
      profile.id,
    );
  },

  async setRank(id: string, rank: Rank): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      "UPDATE user_profile SET rank = ?, updated_at = datetime('now') WHERE id = ?",
      rank,
      id,
    );
  },

  async setStreak(id: string, days: number): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      "UPDATE user_profile SET streak_days = ?, updated_at = datetime('now') WHERE id = ?",
      days,
      id,
    );
  },

  async setBaselinesCompleted(id: string, completed: boolean): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      "UPDATE user_profile SET baselines_completed = ?, updated_at = datetime('now') WHERE id = ?",
      fromBool(completed),
      id,
    );
  },

  async setMustRedoFromWeek(id: string, week: number | null): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      "UPDATE user_profile SET must_redo_from_week = ?, updated_at = datetime('now') WHERE id = ?",
      week,
      id,
    );
  },

  async incrementFreeInvocation(id: string, phase: Phase): Promise<void> {
    const db = await openDatabase();
    const col = `free_invocations_used_p${phase}` as const;
    await db.runAsync(
      `UPDATE user_profile SET ${col} = ${col} + 1, updated_at = datetime('now') WHERE id = ?`,
      id,
    );
  },
};
