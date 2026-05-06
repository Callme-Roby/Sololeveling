import type { GpsPoint, GpsTrack } from '@/domain/types';

import { openDatabase } from '../database';
import { newId } from '../utils';

interface GpsTrackRow {
  id: string;
  started_at: string;
  ended_at: string;
  distance_meters: number;
  duration_seconds: number;
  average_pace_sec_per_km: number | null;
  max_speed_mps: number | null;
  elevation_gain_meters: number | null;
  points_json: string;
  workout_id: string | null;
}

const rowToTrack = (row: GpsTrackRow): GpsTrack => ({
  id: row.id,
  startedAt: row.started_at,
  endedAt: row.ended_at,
  distanceMeters: row.distance_meters,
  durationSeconds: row.duration_seconds,
  averagePaceSecPerKm: row.average_pace_sec_per_km ?? 0,
  maxSpeedMps: row.max_speed_mps ?? 0,
  elevationGainMeters: row.elevation_gain_meters ?? 0,
  points: JSON.parse(row.points_json) as GpsPoint[],
});

export const gpsTrackRepo = {
  async insert(input: Omit<GpsTrack, 'id'> & { workoutId?: string }): Promise<GpsTrack> {
    const db = await openDatabase();
    const id = newId();
    await db.runAsync(
      `INSERT INTO gps_track (
        id, started_at, ended_at, distance_meters, duration_seconds,
        average_pace_sec_per_km, max_speed_mps, elevation_gain_meters,
        points_json, workout_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.startedAt,
      input.endedAt,
      input.distanceMeters,
      input.durationSeconds,
      input.averagePaceSecPerKm,
      input.maxSpeedMps,
      input.elevationGainMeters,
      JSON.stringify(input.points),
      input.workoutId ?? null,
    );
    return { ...input, id };
  },

  async getById(id: string): Promise<GpsTrack | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<GpsTrackRow>(
      'SELECT * FROM gps_track WHERE id = ?',
      id,
    );
    return row ? rowToTrack(row) : null;
  },

  async listRecent(limit = 50): Promise<readonly GpsTrack[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<GpsTrackRow>(
      'SELECT * FROM gps_track ORDER BY started_at DESC LIMIT ?',
      limit,
    );
    return rows.map(rowToTrack);
  },
};
