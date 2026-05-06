export type Stat = 'VIT' | 'AGI' | 'STR' | 'GRP';

export const STATS: readonly Stat[] = ['VIT', 'AGI', 'STR', 'GRP'] as const;

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export const RANK_ORDER: readonly Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'] as const;

export type Phase = 1 | 2 | 3;

export type WorkoutType =
  | 'AGI_GRP'
  | 'VIT_Z2'
  | 'STR_GRP'
  | 'HIIT'
  | 'AGI_STR'
  | 'BOSS'
  | 'REST';

export type ExerciseUnit = 'reps' | 'seconds' | 'meters' | 'minutes';

export type ExerciseFamily =
  | 'hang'
  | 'crush_grip'
  | 'pinch_grip'
  | 'farmer_carry'
  | 'calf_raise'
  | 'tibialis'
  | 'atg'
  | 'sissy_squat'
  | 'reverse_nordic'
  | 'backward_walk_hill'
  | 'balance'
  | 'broad_jump'
  | 'box_jump'
  | 'depth_jump'
  | 'pogo_jump'
  | 'unilateral_bound'
  | 'sprint'
  | 'burpee'
  | 'jump_squat'
  | 'mountain_climber'
  | 'footing_z2'
  | 'hiit_round'
  | 'jump_rope'
  | 'step_up'
  | 'meditation'
  | 'walk';

export interface Exercise {
  id: string;
  name: string;
  family: ExerciseFamily;
  category: Stat;
  unit: ExerciseUnit;
  lestable: boolean;
  baseXP: number;
  description?: string;
}

export interface PlannedExercise {
  exerciseId: string;
  sets?: number;
  repsPerSet?: number;
  durationSecPerSet?: number;
  distanceMPerSet?: number;
  totalDurationMin?: number;
  totalReps?: number;
  notes?: string;
  perSide?: boolean;
}

export interface Workout {
  id: string;
  weekNumber: number;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  type: WorkoutType;
  title: string;
  plannedExercises: PlannedExercise[];
  isBossDay: boolean;
}

export interface DailyQuestPlan {
  phase: Phase;
  hangSecondsTarget: number;
  hangSets: number;
  hangLoadKgHint: number;
  calvesPerSet: number;
  calvesSets: number;
  calvesUnilateral: boolean;
  calvesDeficit: boolean;
  tibialisPerSet: number;
  tibialisSets: number;
  atgHoldSeconds: number;
  atgPausedReps: number;
  crushSecondsPerHand: number;
  crushSets: number;
  crushVariant: 'tennis_ball' | 'hard_ball_or_towel' | 'gripper_or_fruit';
}

export interface DailyQuestRecord {
  id: string;
  date: string;
  hangCompleted: boolean;
  hangSeconds: number;
  hangLoadKg: number;
  calvesCompleted: boolean;
  calvesLoadKg: number;
  atgCompleted: boolean;
  atgSeconds: number;
  crushCompleted: boolean;
  crushSeconds: number;
  allCompleted: boolean;
  penaltyApplied: boolean;
}

export interface Validation {
  id: string;
  exerciseId: string;
  workoutId?: string;
  date: string;
  value: number;
  unit: ExerciseUnit;
  loadKg: number;
  xpEarned: number;
  isPersonalRecord: boolean;
  notes?: string;
}

export interface GpsPoint {
  ts: number;
  lat: number;
  lng: number;
  alt?: number;
  accuracy?: number;
  speed?: number;
}

export interface GpsTrack {
  id: string;
  startedAt: string;
  endedAt: string;
  distanceMeters: number;
  durationSeconds: number;
  averagePaceSecPerKm: number;
  maxSpeedMps: number;
  elevationGainMeters: number;
  points: GpsPoint[];
}

export interface DungeonMarker {
  id: string;
  label: string;
  unit: ExerciseUnit;
  betterIsLower: boolean;
  exerciseFamily?: ExerciseFamily;
}

export type WeeklyDungeonKind = 'standard' | 'porte';

export interface WeeklyDungeon {
  id: string;
  weekNumber: number;
  name: string;
  emoji: string;
  kind: WeeklyDungeonKind;
  protocol: DungeonMarker[];
  titleOnSuccess: string;
  rankAwarded?: Rank;
  narrative?: string;
}

export interface DungeonAttempt {
  id: string;
  dungeonId: string;
  date: string;
  markerValues: Record<string, number>;
  starsAchieved: 0 | 1 | 2 | 3;
  completed: boolean;
  durationSeconds?: number;
  notes?: string;
}

export type HiddenDungeonState =
  | 'dormant'
  | 'apparu'
  | 'cleAcquise'
  | 'reussi'
  | 'echoue'
  | 'expire';

export type HiddenDungeonTriggerKind =
  | 'rain'
  | 'traveler'
  | 'full_moon'
  | 'frost'
  | 'heat'
  | 'storm'
  | 'd6_dawn'
  | 'd6_thousand_steps'
  | 'd6_silence'
  | 'free_invocation';

export interface KeyMission {
  id: string;
  label: string;
  done: boolean;
  doneAt?: string;
}

export interface HiddenDungeon {
  id: string;
  name: string;
  emoji: string;
  trigger: HiddenDungeonTriggerKind;
  description: string;
  keyMissionsTemplate: Omit<KeyMission, 'done' | 'doneAt'>[];
  dungeonObjective: string;
  rewardTitle: string;
  rewardXp: Partial<Record<Stat, number>>;
  rare: boolean;
  weatherBonus: boolean;
}

export interface HiddenDungeonInstance {
  id: string;
  dungeonId: string;
  state: HiddenDungeonState;
  appearedAt?: string;
  keyDeadline?: string;
  keyMissions: KeyMission[];
  attemptedAt?: string;
  succeededAt?: string;
}

export interface Title {
  id: string;
  name: string;
  source: 'weekly_dungeon' | 'porte_dungeon' | 'hidden_dungeon' | 'rank_up' | 'milestone';
  unlockedAt: string;
  dungeonId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  bodyWeightKg: number;
  homeLat: number;
  homeLng: number;
  homeRadiusKm: 30 | 50 | 100;
  rank: Rank;
  streakDays: number;
  startDate: string;
  baselinesCompleted: boolean;
  freeInvocationsUsedByPhase: Record<Phase, number>;
  notificationsEnabled: boolean;
  weatherEnabled: boolean;
  backgroundLocationEnabled: boolean;
  mustRedoFromWeek: number | null;
}

export interface BaselineSet {
  oneKmTimeSec: number;
  burpees5MinReps: number;
  broadJumpCm: number;
  sprint30mSec: number;
  boxJumpHeightCm: number;
  calfRaisesLeft: number;
  calfRaisesRight: number;
  atgHoldLeftSec: number;
  atgHoldRightSec: number;
  balanceEyesClosedLeftSec: number;
  balanceEyesClosedRightSec: number;
  deadHangMaxSec: number;
  tennisBallLeftSec: number;
  tennisBallRightSec: number;
  farmerCarryDistanceM: number;
  energy: number;
  sleep: number;
  motivation: number;
  pain: number;
  takenAt: string;
}

export interface StatProgress {
  stat: Stat;
  totalXp: number;
  level: number;
  rank: Rank;
}

export interface DungeonStarThresholds {
  twoStars: number;
  threeStars: number;
}
