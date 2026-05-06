import { useEffect, useState } from 'react';

import { DAILY_QUESTS_BY_PHASE, phaseForWeek } from '@/data/dailyQuests';
import { getWorkout } from '@/data/workouts';
import type {
  DailyQuestPlan,
  DailyQuestRecord,
  Title,
  Workout,
} from '@/domain/types';
import { dailyQuestRepo, titleRepo } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { dayOfWeekIso, todayDayOfWeek } from '@/utils/format';

export interface TodayPanelData {
  loading: boolean;
  weekNumber: number;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  todayIso: string;
  workout: Workout | undefined;
  questPlan: DailyQuestPlan;
  questRecord: DailyQuestRecord | null;
  titles: readonly Title[];
  refresh: () => Promise<void>;
}

export const useTodayPanel = (): TodayPanelData => {
  const week = useAppStore((s) => s.currentWeek);
  const dow = todayDayOfWeek();
  const todayIso = dayOfWeekIso();

  const [loading, setLoading] = useState(true);
  const [questRecord, setQuestRecord] = useState<DailyQuestRecord | null>(null);
  const [titles, setTitles] = useState<readonly Title[]>([]);

  const phase = phaseForWeek(week);
  const questPlan = DAILY_QUESTS_BY_PHASE[phase];
  const workout = getWorkout(week, dow);

  const refresh = async () => {
    setLoading(true);
    try {
      const [q, t] = await Promise.all([
        dailyQuestRepo.getByDate(todayIso),
        titleRepo.list(),
      ]);
      setQuestRecord(q);
      setTitles(t);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [q, t] = await Promise.all([
        dailyQuestRepo.getByDate(todayIso),
        titleRepo.list(),
      ]);
      if (cancelled) return;
      setQuestRecord(q);
      setTitles(t);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [todayIso]);

  return {
    loading,
    weekNumber: week,
    dayOfWeek: dow,
    todayIso,
    workout,
    questPlan,
    questRecord,
    titles,
    refresh,
  };
};
