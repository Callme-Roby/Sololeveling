import type { NavigatorScreenParams } from '@react-navigation/native';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Profile: undefined;
  Home: { name: string; bodyWeightKg: number };
  Ready: {
    name: string;
    bodyWeightKg: number;
    homeLat: number;
    homeLng: number;
    homeRadiusKm: 30 | 50 | 100;
  };
};

export type DonjonZeroStackParamList = {
  Intro: undefined;
  BlocVIT: undefined;
  BlocAGI: undefined;
  BlocSTR: undefined;
  BlocGRP: undefined;
  Sensation: undefined;
  Complete: undefined;
};

export type MainTabParamList = {
  Mission: undefined;
  Stats: undefined;
  Donjons: undefined;
  Inventaire: undefined;
  Profil: undefined;
};

export type RootStackParamList = {
  Boot: undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  DonjonZero: NavigatorScreenParams<DonjonZeroStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Run: { exerciseId?: string; workoutId?: string } | undefined;
  DungeonRun: { weekNumber: number };
  CalisthenicsSession: undefined;
  AnkleSession: undefined;
  WakeUp: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
