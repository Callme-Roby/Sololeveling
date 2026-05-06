import { useEffect, useState } from 'react';

import { dailyQuestRepo } from '@/services/db';

const startOfWeek = (now: Date = new Date()): Date => {
  const d = new Date(now);
  const dow = ((d.getDay() + 6) % 7);
  d.setDate(d.getDate() - dow);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isoDay = (d: Date): string => d.toISOString().slice(0, 10);

export const useWeekDiscipline = () => {
  const [questsCompletedCount, setQuestsCompletedCount] = useState(0);
  const [totalQuestsThisWeek] = useState(28);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const start = startOfWeek();
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const records = await dailyQuestRepo.listInRange(isoDay(start), isoDay(end));
      let count = 0;
      for (const r of records) {
        if (r.hangCompleted) count++;
        if (r.calvesCompleted) count++;
        if (r.atgCompleted) count++;
        if (r.crushCompleted) count++;
      }
      if (!cancelled) {
        setQuestsCompletedCount(count);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { questsCompletedCount, totalQuestsThisWeek, loading };
};
