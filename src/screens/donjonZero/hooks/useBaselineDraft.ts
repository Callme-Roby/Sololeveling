import { useEffect, useState } from 'react';

import { baselineRepo, type BaselinePartial } from '@/services/db';
import { useAppStore } from '@/store/appStore';

export interface BaselineDraft {
  oneKmTimeSec: number | null;
  burpees5MinReps: number | null;
  broadJumpCm: number | null;
  sprint30mSec: number | null;
  boxJumpHeightCm: number | null;
  calfRaisesLeft: number | null;
  calfRaisesRight: number | null;
  atgHoldLeftSec: number | null;
  atgHoldRightSec: number | null;
  balanceEyesClosedLeftSec: number | null;
  balanceEyesClosedRightSec: number | null;
  deadHangMaxSec: number | null;
  tennisBallLeftSec: number | null;
  tennisBallRightSec: number | null;
  farmerCarryDistanceM: number | null;
  energy: number | null;
  sleep: number | null;
  motivation: number | null;
  pain: number | null;
}

const empty: BaselineDraft = {
  oneKmTimeSec: null,
  burpees5MinReps: null,
  broadJumpCm: null,
  sprint30mSec: null,
  boxJumpHeightCm: null,
  calfRaisesLeft: null,
  calfRaisesRight: null,
  atgHoldLeftSec: null,
  atgHoldRightSec: null,
  balanceEyesClosedLeftSec: null,
  balanceEyesClosedRightSec: null,
  deadHangMaxSec: null,
  tennisBallLeftSec: null,
  tennisBallRightSec: null,
  farmerCarryDistanceM: null,
  energy: null,
  sleep: null,
  motivation: null,
  pain: null,
};

export const useBaselineDraft = () => {
  const userId = useAppStore((s) => s.user?.id);
  const [draft, setDraft] = useState<BaselineDraft>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const stored = await baselineRepo.get(userId);
      if (cancelled) return;
      if (stored) {
        setDraft({
          oneKmTimeSec: stored.oneKmTimeSec || null,
          burpees5MinReps: stored.burpees5MinReps || null,
          broadJumpCm: stored.broadJumpCm || null,
          sprint30mSec: stored.sprint30mSec || null,
          boxJumpHeightCm: stored.boxJumpHeightCm || null,
          calfRaisesLeft: stored.calfRaisesLeft || null,
          calfRaisesRight: stored.calfRaisesRight || null,
          atgHoldLeftSec: stored.atgHoldLeftSec || null,
          atgHoldRightSec: stored.atgHoldRightSec || null,
          balanceEyesClosedLeftSec: stored.balanceEyesClosedLeftSec || null,
          balanceEyesClosedRightSec: stored.balanceEyesClosedRightSec || null,
          deadHangMaxSec: stored.deadHangMaxSec || null,
          tennisBallLeftSec: stored.tennisBallLeftSec || null,
          tennisBallRightSec: stored.tennisBallRightSec || null,
          farmerCarryDistanceM: stored.farmerCarryDistanceM || null,
          energy: stored.energy || null,
          sleep: stored.sleep || null,
          motivation: stored.motivation || null,
          pain: stored.pain || null,
        });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persist = async (
    patch: BaselinePartial,
    isComplete: boolean,
  ): Promise<void> => {
    if (!userId) return;
    await baselineRepo.upsertPartial(
      userId,
      { ...patch, takenAt: new Date().toISOString() },
      isComplete,
    );
  };

  return { draft, setDraft, loading, persist };
};

export const parseNumber = (v: string): number | null => {
  if (v.trim() === '') return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

export const parseTimeSeconds = (mmss: string): number | null => {
  const trimmed = mmss.trim();
  if (trimmed === '') return null;
  if (trimmed.includes(':')) {
    const [m, s] = trimmed.split(':');
    const min = Number(m);
    const sec = Number(s);
    if (!Number.isFinite(min) || !Number.isFinite(sec)) return null;
    return Math.round(min * 60 + sec);
  }
  const n = Number(trimmed.replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n) : null;
};

export const formatTimeSeconds = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined || seconds === 0) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};
