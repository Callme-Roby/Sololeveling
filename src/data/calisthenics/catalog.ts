/**
 * Catalogue calisthenie / street workout, oriente debutant.
 * Chaque pattern de mouvement a une echelle de variantes du plus facile
 * au plus dur ("levels"). On demarre bas et on monte cran par cran.
 */

export type MovementPattern =
  | 'push'
  | 'pull_horizontal'
  | 'pull_vertical'
  | 'dip'
  | 'core'
  | 'legs'
  | 'warmup';

export type CalUnit = 'reps' | 'seconds';

export type CalStat = 'PUSH' | 'PULL' | 'CORE' | 'LEGS';

export interface CalLevel {
  exerciseId: string;
  name: string;
  unit: CalUnit;
  sets: number;
  startTarget: number;
  capTarget: number;
  step: number;
  instructions: string;
}

export interface CalPatternDef {
  id: MovementPattern;
  label: string;
  emoji: string;
  stat: CalStat;
  baseXpPerUnit: number;
  levels: readonly CalLevel[];
}

export const CALISTHENICS_PATTERNS: readonly CalPatternDef[] = [
  {
    id: 'push',
    label: 'Poussee',
    emoji: '\u{1F4AA}',
    stat: 'PUSH',
    baseXpPerUnit: 1,
    levels: [
      {
        exerciseId: 'push_wall',
        name: 'Pompes au mur',
        unit: 'reps',
        sets: 3,
        startTarget: 8,
        capTarget: 15,
        step: 1,
        instructions: 'Mains au mur, corps droit, flechis les bras lentement.',
      },
      {
        exerciseId: 'push_incline',
        name: 'Pompes inclinees (banc/rebord)',
        unit: 'reps',
        sets: 3,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Mains surelevees sur un banc ou muret.',
      },
      {
        exerciseId: 'push_knee',
        name: 'Pompes sur les genoux',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Genoux au sol, gainage, descente controlee.',
      },
      {
        exerciseId: 'push_full',
        name: 'Pompes completes',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Corps gaine de la tete aux talons. Amplitude complete.',
      },
      {
        exerciseId: 'push_decline',
        name: 'Pompes declinees (pieds sureleves)',
        unit: 'reps',
        sets: 4,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Pieds sur un banc, plus de charge sur les epaules.',
      },
    ],
  },
  {
    id: 'pull_horizontal',
    label: 'Tirage horizontal',
    emoji: '\u{1F91A}',
    stat: 'PULL',
    baseXpPerUnit: 1.2,
    levels: [
      {
        exerciseId: 'row_high',
        name: 'Tirage australien barre haute',
        unit: 'reps',
        sets: 3,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Barre a hauteur de hanche, corps oblique, tire la poitrine.',
      },
      {
        exerciseId: 'row_mid',
        name: 'Tirage australien barre moyenne',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Barre plus basse, corps plus horizontal.',
      },
      {
        exerciseId: 'row_low',
        name: 'Tirage australien pieds sureleves',
        unit: 'reps',
        sets: 4,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Pieds sur un banc, corps quasi horizontal.',
      },
    ],
  },
  {
    id: 'pull_vertical',
    label: 'Traction',
    emoji: '\u{1F9D7}',
    stat: 'PULL',
    baseXpPerUnit: 1.5,
    levels: [
      {
        exerciseId: 'hang_dead',
        name: 'Suspension barre (dead hang)',
        unit: 'seconds',
        sets: 3,
        startTarget: 15,
        capTarget: 40,
        step: 3,
        instructions: 'Bras tendus, epaules engagees. Construit la prise.',
      },
      {
        exerciseId: 'pull_scapular',
        name: 'Tractions scapulaires',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Sans plier les bras, rapproche les omoplates.',
      },
      {
        exerciseId: 'pull_negative',
        name: 'Tractions negatives',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 6,
        step: 1,
        instructions: 'Monte avec un saut, descends le plus lentement possible.',
      },
      {
        exerciseId: 'pull_band',
        name: 'Tractions assistees (elastique)',
        unit: 'reps',
        sets: 3,
        startTarget: 4,
        capTarget: 8,
        step: 1,
        instructions: 'Elastique sous les pieds/genoux pour alleger.',
      },
      {
        exerciseId: 'pull_full',
        name: 'Tractions completes',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 8,
        step: 1,
        instructions: 'Menton au-dessus de la barre, amplitude complete.',
      },
    ],
  },
  {
    id: 'dip',
    label: 'Dips',
    emoji: '\u{1F53B}',
    stat: 'PUSH',
    baseXpPerUnit: 1.3,
    levels: [
      {
        exerciseId: 'dip_bench',
        name: 'Dips sur banc',
        unit: 'reps',
        sets: 3,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Mains sur un banc derriere toi, pieds au sol.',
      },
      {
        exerciseId: 'dip_bar_negative',
        name: 'Dips barres negatives',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 6,
        step: 1,
        instructions: 'Descente lente sur les barres paralleles.',
      },
      {
        exerciseId: 'dip_bar',
        name: 'Dips barres completes',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 10,
        step: 1,
        instructions: 'Amplitude complete, epaules basses.',
      },
    ],
  },
  {
    id: 'core',
    label: 'Gainage',
    emoji: '\u{1F525}',
    stat: 'CORE',
    baseXpPerUnit: 0.8,
    levels: [
      {
        exerciseId: 'core_deadbug',
        name: 'Dead bug',
        unit: 'reps',
        sets: 3,
        startTarget: 8,
        capTarget: 16,
        step: 1,
        instructions: 'Dos plaque au sol, bras et jambe opposes qui descendent.',
      },
      {
        exerciseId: 'core_plank',
        name: 'Planche',
        unit: 'seconds',
        sets: 3,
        startTarget: 15,
        capTarget: 45,
        step: 5,
        instructions: 'Corps aligne, abdos et fessiers serres.',
      },
      {
        exerciseId: 'core_hollow',
        name: 'Hollow hold',
        unit: 'seconds',
        sets: 3,
        startTarget: 10,
        capTarget: 40,
        step: 5,
        instructions: 'Bas du dos plaque, jambes et epaules decollees.',
      },
      {
        exerciseId: 'core_knee_raise',
        name: 'Releves de genoux suspendu',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Suspendu a la barre, monte les genoux vers la poitrine.',
      },
    ],
  },
  {
    id: 'legs',
    label: 'Jambes',
    emoji: '\u{1F9B5}',
    stat: 'LEGS',
    baseXpPerUnit: 0.7,
    levels: [
      {
        exerciseId: 'legs_squat',
        name: 'Squats poids du corps',
        unit: 'reps',
        sets: 3,
        startTarget: 10,
        capTarget: 20,
        step: 2,
        instructions: 'Descente cuisses paralleles, talons au sol.',
      },
      {
        exerciseId: 'legs_lunge',
        name: 'Fentes alternees',
        unit: 'reps',
        sets: 3,
        startTarget: 8,
        capTarget: 16,
        step: 1,
        instructions: 'Genou arriere vers le sol, buste droit.',
      },
      {
        exerciseId: 'legs_calf',
        name: 'Elevations mollets',
        unit: 'reps',
        sets: 3,
        startTarget: 12,
        capTarget: 25,
        step: 2,
        instructions: 'Monte sur la pointe, controle. Doux pour la cheville.',
      },
    ],
  },
  {
    id: 'warmup',
    label: 'Echauffement',
    emoji: '\u{1F504}',
    stat: 'CORE',
    baseXpPerUnit: 0.3,
    levels: [
      {
        exerciseId: 'warmup_jumping_jacks',
        name: 'Jumping jacks',
        unit: 'reps',
        sets: 1,
        startTarget: 20,
        capTarget: 40,
        step: 5,
        instructions: 'Reveille le cardio et les epaules.',
      },
      {
        exerciseId: 'warmup_band_pullapart',
        name: 'Rotations + ouverture epaules',
        unit: 'reps',
        sets: 2,
        startTarget: 12,
        capTarget: 20,
        step: 2,
        instructions: 'Cercles de bras et ouvertures pour preparer le tirage.',
      },
    ],
  },
];

export const CAL_PATTERNS_BY_ID = Object.freeze(
  CALISTHENICS_PATTERNS.reduce<Record<MovementPattern, CalPatternDef>>(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<MovementPattern, CalPatternDef>,
  ),
);

export const getPattern = (id: MovementPattern): CalPatternDef =>
  CAL_PATTERNS_BY_ID[id];

export const CAL_STAT_LABEL: Record<CalStat, string> = {
  PUSH: 'Poussee',
  PULL: 'Tirage',
  CORE: 'Gainage',
  LEGS: 'Jambes',
};
