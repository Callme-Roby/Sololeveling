import { create } from 'zustand';

import type { Phase, Rank, UserProfile } from '@/domain/types';
import { phaseForWeek } from '@/data/dailyQuests';

export type BootStatus = 'pending' | 'ready' | 'error';

export interface AppStoreState {
  bootStatus: BootStatus;
  bootError: string | null;
  user: UserProfile | null;
  currentWeek: number;

  setBootReady: (user: UserProfile | null) => void;
  setBootError: (msg: string) => void;

  setUser: (user: UserProfile | null) => void;
  patchUser: (patch: Partial<UserProfile>) => void;
  setBaselinesCompleted: (done: boolean) => void;
  setRank: (rank: Rank) => void;
  setStreakDays: (n: number) => void;
  setCurrentWeek: (week: number) => void;
}

const computeWeekFromStartDate = (startDate: string, cap?: number | null): number => {
  const start = new Date(startDate).getTime();
  if (Number.isNaN(start)) return 1;
  const diffDays = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  const dateBased = Math.max(1, Math.min(12, Math.floor(diffDays / 7) + 1));
  return cap && cap >= 1 ? Math.min(dateBased, cap) : dateBased;
};

export const useAppStore = create<AppStoreState>((set) => ({
  bootStatus: 'pending',
  bootError: null,
  user: null,
  currentWeek: 1,

  setBootReady: (user) =>
    set({
      bootStatus: 'ready',
      bootError: null,
      user,
      currentWeek: user
        ? computeWeekFromStartDate(user.startDate, user.mustRedoFromWeek)
        : 1,
    }),

  setBootError: (msg) =>
    set({ bootStatus: 'error', bootError: msg }),

  setUser: (user) =>
    set({
      user,
      currentWeek: user
        ? computeWeekFromStartDate(user.startDate, user.mustRedoFromWeek)
        : 1,
    }),

  patchUser: (patch) =>
    set((s) => (s.user ? { user: { ...s.user, ...patch } } : {})),

  setBaselinesCompleted: (done) =>
    set((s) =>
      s.user ? { user: { ...s.user, baselinesCompleted: done } } : {},
    ),

  setRank: (rank) =>
    set((s) => (s.user ? { user: { ...s.user, rank } } : {})),

  setStreakDays: (streakDays) =>
    set((s) => (s.user ? { user: { ...s.user, streakDays } } : {})),

  setCurrentWeek: (currentWeek) => set({ currentWeek }),
}));

export const selectCurrentPhase = (s: AppStoreState): Phase =>
  phaseForWeek(s.currentWeek);

export const selectIsOnboarded = (s: AppStoreState): boolean =>
  s.user !== null;

export const selectIsBaselined = (s: AppStoreState): boolean =>
  Boolean(s.user?.baselinesCompleted);
