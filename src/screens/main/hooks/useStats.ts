import { useEffect, useState } from 'react';

import type { Stat } from '@/domain/types';
import { appStateRepo, validationRepo } from '@/services/db';
import { levelFromXp, progressInLevel, sumXpByStat } from '@/services/stats';
import { useAppStore } from '@/store/appStore';

const DONJON_ZERO_GRANT_KEY = 'donjon_zero_grant_done';
const DONJON_ZERO_XP_PER_STAT = 25;

export interface StatProgressView {
  stat: Stat;
  totalXp: number;
  level: number;
  progress: number;
}

export interface UseStatsResult {
  loading: boolean;
  totals: Record<Stat, number>;
  progress: readonly StatProgressView[];
  refresh: () => Promise<void>;
}

const SEED_EXERCISES_BY_STAT: Record<Stat, string> = {
  VIT: 'footing_z2',
  AGI: 'broad_jump',
  STR: 'atg_hold',
  GRP: 'hang_passive',
};

export const useStats = (): UseStatsResult => {
  const user = useAppStore((s) => s.user);
  const baselinesCompleted = user?.baselinesCompleted ?? false;
  const userId = user?.id;
  const [totals, setTotals] = useState<Record<Stat, number>>({
    VIT: 0,
    AGI: 0,
    STR: 0,
    GRP: 0,
  });
  const [loading, setLoading] = useState(true);

  const compute = async () => {
    const all = await validationRepo.listAll();
    setTotals(sumXpByStat(all));
  };

  const refresh = async () => {
    setLoading(true);
    try {
      await compute();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (baselinesCompleted && userId) {
        const granted = await appStateRepo.get(DONJON_ZERO_GRANT_KEY);
        if (!granted) {
          const today = new Date().toISOString().slice(0, 10);
          for (const stat of ['VIT', 'AGI', 'STR', 'GRP'] as Stat[]) {
            await validationRepo.insert({
              exerciseId: SEED_EXERCISES_BY_STAT[stat],
              date: today,
              value: 0,
              unit: 'reps',
              loadKg: 0,
              xpEarned: DONJON_ZERO_XP_PER_STAT,
              isPersonalRecord: false,
              notes: 'Recompense Donjon Zero',
            });
          }
          await appStateRepo.set(DONJON_ZERO_GRANT_KEY, new Date().toISOString());
        }
      }
      if (!cancelled) {
        await compute();
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [baselinesCompleted, userId]);

  const progress: StatProgressView[] = (
    ['VIT', 'AGI', 'STR', 'GRP'] as Stat[]
  ).map((stat) => ({
    stat,
    totalXp: totals[stat],
    level: levelFromXp(totals[stat]),
    progress: progressInLevel(totals[stat]),
  }));

  return { loading, totals, progress, refresh };
};
