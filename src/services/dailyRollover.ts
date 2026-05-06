import { RANK_ORDER, type Rank, type UserProfile } from '@/domain/types';
import {
  APP_STATE_KEYS,
  appStateRepo,
  dailyQuestRepo,
  userRepo,
} from '@/services/db';
import { dayOfWeekIso } from '@/utils/format';

const PENALTY_THRESHOLD = 3;
const STREAK_LOOKBACK_DAYS = 90;

const dayOffset = (iso: string, deltaDays: number): string => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + deltaDays);
  return dayOfWeekIso(d);
};

export const recomputeStreakDays = async (
  todayIso: string = dayOfWeekIso(),
): Promise<number> => {
  let streak = 0;
  for (let i = 0; i < STREAK_LOOKBACK_DAYS; i++) {
    const day = dayOffset(todayIso, -i);
    const rec = await dailyQuestRepo.getByDate(day);
    if (!rec?.allCompleted) break;
    streak++;
  }
  return streak;
};

export const persistStreak = async (
  user: UserProfile,
  streakDays: number,
): Promise<UserProfile> => {
  if (streakDays === user.streakDays) return user;
  await userRepo.setStreak(user.id, streakDays);
  return { ...user, streakDays };
};

export interface RolloverResult {
  ranAt: string;
  alreadyRanToday: boolean;
  yesterdayMissed: boolean;
  penaltyCount: number;
  rankDemoted: boolean;
  newRank: Rank;
  newStreakDays: number;
}

export const runDailyRollover = async (
  user: UserProfile,
): Promise<{ user: UserProfile; result: RolloverResult }> => {
  const todayIso = dayOfWeekIso();
  const last = await appStateRepo.get(APP_STATE_KEYS.LAST_QUEST_CHECK_DATE);

  if (last === todayIso) {
    const streak = await recomputeStreakDays(todayIso);
    const updated = await persistStreak(user, streak);
    return {
      user: updated,
      result: {
        ranAt: todayIso,
        alreadyRanToday: true,
        yesterdayMissed: false,
        penaltyCount:
          (await appStateRepo.getJson<number>(APP_STATE_KEYS.CONSECUTIVE_PENALTIES)) ?? 0,
        rankDemoted: false,
        newRank: user.rank,
        newStreakDays: updated.streakDays,
      },
    };
  }

  const yesterdayIso = dayOffset(todayIso, -1);
  const startIso = user.startDate.slice(0, 10);
  const yesterdayBeforeStart = yesterdayIso < startIso;

  let penaltyCount =
    (await appStateRepo.getJson<number>(APP_STATE_KEYS.CONSECUTIVE_PENALTIES)) ?? 0;
  let newRank: Rank = user.rank;
  let rankDemoted = false;
  let yesterdayMissed = false;

  if (!yesterdayBeforeStart) {
    const yRec = await dailyQuestRepo.getByDate(yesterdayIso);
    if (yRec?.allCompleted) {
      penaltyCount = 0;
    } else {
      yesterdayMissed = true;
      penaltyCount += 1;
      const todayRec = await dailyQuestRepo.getByDate(todayIso);
      await dailyQuestRepo.upsert({
        date: todayIso,
        hangCompleted: todayRec?.hangCompleted ?? false,
        hangSeconds: todayRec?.hangSeconds ?? 0,
        hangLoadKg: todayRec?.hangLoadKg ?? 0,
        calvesCompleted: todayRec?.calvesCompleted ?? false,
        calvesLoadKg: todayRec?.calvesLoadKg ?? 0,
        atgCompleted: todayRec?.atgCompleted ?? false,
        atgSeconds: todayRec?.atgSeconds ?? 0,
        crushCompleted: todayRec?.crushCompleted ?? false,
        crushSeconds: todayRec?.crushSeconds ?? 0,
        penaltyApplied: true,
      });
    }
  }

  if (penaltyCount >= PENALTY_THRESHOLD) {
    const idx = RANK_ORDER.indexOf(user.rank);
    if (idx > 0) {
      newRank = RANK_ORDER[idx - 1];
      rankDemoted = true;
      await userRepo.setRank(user.id, newRank);
    }
    penaltyCount = 0;
  }

  await appStateRepo.setJson(APP_STATE_KEYS.CONSECUTIVE_PENALTIES, penaltyCount);
  await appStateRepo.set(APP_STATE_KEYS.LAST_QUEST_CHECK_DATE, todayIso);

  const streak = await recomputeStreakDays(todayIso);
  const updated = await persistStreak({ ...user, rank: newRank }, streak);

  return {
    user: updated,
    result: {
      ranAt: todayIso,
      alreadyRanToday: false,
      yesterdayMissed,
      penaltyCount,
      rankDemoted,
      newRank,
      newStreakDays: streak,
    },
  };
};
