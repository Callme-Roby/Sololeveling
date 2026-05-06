import type { BaselineSet } from '@/domain/types';

import { openDatabase } from '../database';
import { fromBool, toBool } from '../utils';

interface BaselineRow {
  user_id: string;
  one_km_time_sec: number | null;
  burpees_5min_reps: number | null;
  broad_jump_cm: number | null;
  sprint_30m_sec: number | null;
  box_jump_height_cm: number | null;
  calf_raises_left: number | null;
  calf_raises_right: number | null;
  atg_hold_left_sec: number | null;
  atg_hold_right_sec: number | null;
  balance_eyes_closed_left_sec: number | null;
  balance_eyes_closed_right_sec: number | null;
  dead_hang_max_sec: number | null;
  tennis_ball_left_sec: number | null;
  tennis_ball_right_sec: number | null;
  farmer_carry_distance_m: number | null;
  energy: number | null;
  sleep: number | null;
  motivation: number | null;
  pain: number | null;
  taken_at: string;
  partial: number;
}

export type BaselinePartial = Partial<Omit<BaselineSet, 'takenAt'>> & {
  takenAt?: string;
};

const rowToBaseline = (row: BaselineRow): BaselineSet & { partial: boolean } => ({
  oneKmTimeSec: row.one_km_time_sec ?? 0,
  burpees5MinReps: row.burpees_5min_reps ?? 0,
  broadJumpCm: row.broad_jump_cm ?? 0,
  sprint30mSec: row.sprint_30m_sec ?? 0,
  boxJumpHeightCm: row.box_jump_height_cm ?? 0,
  calfRaisesLeft: row.calf_raises_left ?? 0,
  calfRaisesRight: row.calf_raises_right ?? 0,
  atgHoldLeftSec: row.atg_hold_left_sec ?? 0,
  atgHoldRightSec: row.atg_hold_right_sec ?? 0,
  balanceEyesClosedLeftSec: row.balance_eyes_closed_left_sec ?? 0,
  balanceEyesClosedRightSec: row.balance_eyes_closed_right_sec ?? 0,
  deadHangMaxSec: row.dead_hang_max_sec ?? 0,
  tennisBallLeftSec: row.tennis_ball_left_sec ?? 0,
  tennisBallRightSec: row.tennis_ball_right_sec ?? 0,
  farmerCarryDistanceM: row.farmer_carry_distance_m ?? 0,
  energy: row.energy ?? 0,
  sleep: row.sleep ?? 0,
  motivation: row.motivation ?? 0,
  pain: row.pain ?? 0,
  takenAt: row.taken_at,
  partial: toBool(row.partial),
});

export const baselineRepo = {
  async get(userId: string): Promise<(BaselineSet & { partial: boolean }) | null> {
    const db = await openDatabase();
    const row = await db.getFirstAsync<BaselineRow>(
      'SELECT * FROM baseline WHERE user_id = ?',
      userId,
    );
    return row ? rowToBaseline(row) : null;
  },

  async upsertPartial(
    userId: string,
    partial: BaselinePartial,
    isComplete: boolean,
  ): Promise<void> {
    const db = await openDatabase();
    const existing = await db.getFirstAsync<BaselineRow>(
      'SELECT * FROM baseline WHERE user_id = ?',
      userId,
    );

    const merged = {
      one_km_time_sec: partial.oneKmTimeSec ?? existing?.one_km_time_sec ?? null,
      burpees_5min_reps: partial.burpees5MinReps ?? existing?.burpees_5min_reps ?? null,
      broad_jump_cm: partial.broadJumpCm ?? existing?.broad_jump_cm ?? null,
      sprint_30m_sec: partial.sprint30mSec ?? existing?.sprint_30m_sec ?? null,
      box_jump_height_cm:
        partial.boxJumpHeightCm ?? existing?.box_jump_height_cm ?? null,
      calf_raises_left: partial.calfRaisesLeft ?? existing?.calf_raises_left ?? null,
      calf_raises_right:
        partial.calfRaisesRight ?? existing?.calf_raises_right ?? null,
      atg_hold_left_sec: partial.atgHoldLeftSec ?? existing?.atg_hold_left_sec ?? null,
      atg_hold_right_sec:
        partial.atgHoldRightSec ?? existing?.atg_hold_right_sec ?? null,
      balance_eyes_closed_left_sec:
        partial.balanceEyesClosedLeftSec ??
        existing?.balance_eyes_closed_left_sec ??
        null,
      balance_eyes_closed_right_sec:
        partial.balanceEyesClosedRightSec ??
        existing?.balance_eyes_closed_right_sec ??
        null,
      dead_hang_max_sec:
        partial.deadHangMaxSec ?? existing?.dead_hang_max_sec ?? null,
      tennis_ball_left_sec:
        partial.tennisBallLeftSec ?? existing?.tennis_ball_left_sec ?? null,
      tennis_ball_right_sec:
        partial.tennisBallRightSec ?? existing?.tennis_ball_right_sec ?? null,
      farmer_carry_distance_m:
        partial.farmerCarryDistanceM ?? existing?.farmer_carry_distance_m ?? null,
      energy: partial.energy ?? existing?.energy ?? null,
      sleep: partial.sleep ?? existing?.sleep ?? null,
      motivation: partial.motivation ?? existing?.motivation ?? null,
      pain: partial.pain ?? existing?.pain ?? null,
      taken_at: partial.takenAt ?? existing?.taken_at ?? new Date().toISOString(),
      partial: fromBool(!isComplete),
    };

    if (existing) {
      await db.runAsync(
        `UPDATE baseline SET
          one_km_time_sec = ?, burpees_5min_reps = ?, broad_jump_cm = ?,
          sprint_30m_sec = ?, box_jump_height_cm = ?,
          calf_raises_left = ?, calf_raises_right = ?,
          atg_hold_left_sec = ?, atg_hold_right_sec = ?,
          balance_eyes_closed_left_sec = ?, balance_eyes_closed_right_sec = ?,
          dead_hang_max_sec = ?, tennis_ball_left_sec = ?, tennis_ball_right_sec = ?,
          farmer_carry_distance_m = ?,
          energy = ?, sleep = ?, motivation = ?, pain = ?,
          taken_at = ?, partial = ?
        WHERE user_id = ?`,
        merged.one_km_time_sec,
        merged.burpees_5min_reps,
        merged.broad_jump_cm,
        merged.sprint_30m_sec,
        merged.box_jump_height_cm,
        merged.calf_raises_left,
        merged.calf_raises_right,
        merged.atg_hold_left_sec,
        merged.atg_hold_right_sec,
        merged.balance_eyes_closed_left_sec,
        merged.balance_eyes_closed_right_sec,
        merged.dead_hang_max_sec,
        merged.tennis_ball_left_sec,
        merged.tennis_ball_right_sec,
        merged.farmer_carry_distance_m,
        merged.energy,
        merged.sleep,
        merged.motivation,
        merged.pain,
        merged.taken_at,
        merged.partial,
        userId,
      );
    } else {
      await db.runAsync(
        `INSERT INTO baseline (
          user_id, one_km_time_sec, burpees_5min_reps, broad_jump_cm,
          sprint_30m_sec, box_jump_height_cm,
          calf_raises_left, calf_raises_right,
          atg_hold_left_sec, atg_hold_right_sec,
          balance_eyes_closed_left_sec, balance_eyes_closed_right_sec,
          dead_hang_max_sec, tennis_ball_left_sec, tennis_ball_right_sec,
          farmer_carry_distance_m,
          energy, sleep, motivation, pain,
          taken_at, partial
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        userId,
        merged.one_km_time_sec,
        merged.burpees_5min_reps,
        merged.broad_jump_cm,
        merged.sprint_30m_sec,
        merged.box_jump_height_cm,
        merged.calf_raises_left,
        merged.calf_raises_right,
        merged.atg_hold_left_sec,
        merged.atg_hold_right_sec,
        merged.balance_eyes_closed_left_sec,
        merged.balance_eyes_closed_right_sec,
        merged.dead_hang_max_sec,
        merged.tennis_ball_left_sec,
        merged.tennis_ball_right_sec,
        merged.farmer_carry_distance_m,
        merged.energy,
        merged.sleep,
        merged.motivation,
        merged.pain,
        merged.taken_at,
        merged.partial,
      );
    }
  },
};
