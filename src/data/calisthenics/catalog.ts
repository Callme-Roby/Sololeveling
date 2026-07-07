/**
 * Catalogue calisthenie / street workout, oriente debutant.
 *
 * Objectifs esthetiques cibles :
 *  - DOS   : elargir le dos (largeur des dorsaux)
 *  - PECS  : volume des pectoraux complets (haut, milieu, bas)
 *  - BRAS  : bras definis + volume, de l'epaule a l'avant-bras
 *  - ABDOS : ceinture abdominale plus tracee
 *
 * Chaque pattern a une echelle de variantes du plus facile au plus dur
 * ("levels"). On demarre bas et on monte cran par cran.
 */

export type MovementPattern =
  | 'pull_vertical'
  | 'pull_horizontal'
  | 'push'
  | 'dip'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'grip'
  | 'core'
  | 'warmup';

export type CalUnit = 'reps' | 'seconds';

export type CalStat = 'DOS' | 'PECS' | 'BRAS' | 'ABDOS';

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
  goal: string;
  baseXpPerUnit: number;
  levels: readonly CalLevel[];
}

export const CALISTHENICS_PATTERNS: readonly CalPatternDef[] = [
  {
    id: 'pull_vertical',
    label: 'Tractions',
    emoji: '\u{1F9D7}',
    stat: 'DOS',
    goal: 'Largeur du dos',
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
        instructions: 'Bras tendus, epaules engagees. Base de la prise et du dos.',
      },
      {
        exerciseId: 'pull_scapular',
        name: 'Tractions scapulaires',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Sans plier les bras, rapproche les omoplates vers le bas.',
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
      {
        exerciseId: 'pull_wide',
        name: 'Tractions prise large',
        unit: 'reps',
        sets: 4,
        startTarget: 3,
        capTarget: 8,
        step: 1,
        instructions: 'Prise plus large que les epaules : cible la largeur du dos.',
      },
    ],
  },
  {
    id: 'pull_horizontal',
    label: 'Tirage horizontal',
    emoji: '\u{1F91A}',
    stat: 'DOS',
    goal: 'Epaisseur et largeur du dos',
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
      {
        exerciseId: 'row_wide',
        name: 'Tirage australien prise large',
        unit: 'reps',
        sets: 4,
        startTarget: 5,
        capTarget: 12,
        step: 1,
        instructions: 'Prise large, coudes ouverts : haut du dos et largeur.',
      },
    ],
  },
  {
    id: 'push',
    label: 'Pompes (pectoraux)',
    emoji: '\u{1F4AA}',
    stat: 'PECS',
    goal: 'Volume des pectoraux',
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
        name: 'Pompes inclinees (bas des pecs)',
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
        exerciseId: 'push_wide',
        name: 'Pompes prise large',
        unit: 'reps',
        sets: 3,
        startTarget: 6,
        capTarget: 14,
        step: 1,
        instructions: 'Mains larges : etire et cible la largeur des pectoraux.',
      },
      {
        exerciseId: 'push_decline',
        name: 'Pompes declinees (haut des pecs)',
        unit: 'reps',
        sets: 4,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Pieds sureleves : charge le haut des pectoraux et les epaules.',
      },
    ],
  },
  {
    id: 'dip',
    label: 'Dips (bas des pecs)',
    emoji: '\u{1F53B}',
    stat: 'PECS',
    goal: 'Bas des pectoraux + volume',
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
        instructions: 'Descente lente sur les barres paralleles, buste penche.',
      },
      {
        exerciseId: 'dip_bar',
        name: 'Dips barres completes',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 10,
        step: 1,
        instructions: 'Buste legerement penche en avant pour cibler les pecs.',
      },
    ],
  },
  {
    id: 'shoulders',
    label: 'Epaules (pike)',
    emoji: '\u{1F3D4}\u{FE0F}',
    stat: 'BRAS',
    goal: 'Epaules rondes et definies',
    baseXpPerUnit: 1.2,
    levels: [
      {
        exerciseId: 'pike_knee',
        name: 'Pompes pike (genoux flechis)',
        unit: 'reps',
        sets: 3,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Bassin haut, tete vers le sol. Debut du travail epaules.',
      },
      {
        exerciseId: 'pike_full',
        name: 'Pompes pike',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 10,
        step: 1,
        instructions: 'Jambes tendues, corps en V inverse.',
      },
      {
        exerciseId: 'pike_elevated',
        name: 'Pompes pike pieds sureleves',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 10,
        step: 1,
        instructions: 'Pieds sur un banc : presque vertical, gros stimulus epaules.',
      },
      {
        exerciseId: 'handstand_wall',
        name: 'Gainage ATR au mur',
        unit: 'seconds',
        sets: 3,
        startTarget: 10,
        capTarget: 40,
        step: 5,
        instructions: 'Poirier contre le mur, gainage complet.',
      },
    ],
  },
  {
    id: 'biceps',
    label: 'Biceps',
    emoji: '\u{1F4AA}',
    stat: 'BRAS',
    goal: 'Bras : volume biceps',
    baseXpPerUnit: 1.3,
    levels: [
      {
        exerciseId: 'curl_band',
        name: 'Curls elastique',
        unit: 'reps',
        sets: 3,
        startTarget: 10,
        capTarget: 18,
        step: 2,
        instructions: 'Elastique sous les pieds, remonte les mains vers les epaules.',
      },
      {
        exerciseId: 'chin_negative',
        name: 'Chin-ups negatives (supination)',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 6,
        step: 1,
        instructions: 'Paumes vers toi, descente lente. Fort sur les biceps.',
      },
      {
        exerciseId: 'chin_band',
        name: 'Chin-ups assistees',
        unit: 'reps',
        sets: 3,
        startTarget: 4,
        capTarget: 8,
        step: 1,
        instructions: 'Prise supination, elastique pour alleger.',
      },
      {
        exerciseId: 'chin_full',
        name: 'Chin-ups completes',
        unit: 'reps',
        sets: 3,
        startTarget: 3,
        capTarget: 10,
        step: 1,
        instructions: 'Paumes vers toi, menton au-dessus de la barre.',
      },
    ],
  },
  {
    id: 'triceps',
    label: 'Triceps',
    emoji: '\u{1F91C}',
    stat: 'BRAS',
    goal: 'Bras : volume triceps',
    baseXpPerUnit: 1.2,
    levels: [
      {
        exerciseId: 'tri_bench_dip',
        name: 'Dips banc (triceps)',
        unit: 'reps',
        sets: 3,
        startTarget: 8,
        capTarget: 14,
        step: 1,
        instructions: 'Coudes serres vers l\'arriere, cible les triceps.',
      },
      {
        exerciseId: 'tri_diamond_knee',
        name: 'Pompes diamant (genoux)',
        unit: 'reps',
        sets: 3,
        startTarget: 6,
        capTarget: 12,
        step: 1,
        instructions: 'Mains en losange sous la poitrine, genoux au sol.',
      },
      {
        exerciseId: 'tri_diamond',
        name: 'Pompes diamant',
        unit: 'reps',
        sets: 3,
        startTarget: 5,
        capTarget: 10,
        step: 1,
        instructions: 'Mains en losange, coudes le long du corps.',
      },
    ],
  },
  {
    id: 'grip',
    label: 'Avant-bras / grip',
    emoji: '\u{270A}',
    stat: 'BRAS',
    goal: 'Avant-bras et prise',
    baseXpPerUnit: 0.8,
    levels: [
      {
        exerciseId: 'grip_hang',
        name: 'Suspension barre (avant-bras)',
        unit: 'seconds',
        sets: 3,
        startTarget: 20,
        capTarget: 50,
        step: 5,
        instructions: 'Tenir la barre le plus longtemps possible, epaules actives.',
      },
      {
        exerciseId: 'grip_towel',
        name: 'Suspension sur serviette',
        unit: 'seconds',
        sets: 3,
        startTarget: 12,
        capTarget: 35,
        step: 3,
        instructions: 'Une serviette par main : prise et avant-bras a fond.',
      },
    ],
  },
  {
    id: 'core',
    label: 'Ceinture abdominale',
    emoji: '\u{1F525}',
    stat: 'ABDOS',
    goal: 'Abdos traces',
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
      {
        exerciseId: 'core_leg_raise',
        name: 'Releves de jambes suspendu',
        unit: 'reps',
        sets: 3,
        startTarget: 4,
        capTarget: 12,
        step: 1,
        instructions: 'Jambes tendues montees a l\'horizontale. Bas des abdos.',
      },
    ],
  },
  {
    id: 'warmup',
    label: 'Echauffement',
    emoji: '\u{1F504}',
    stat: 'ABDOS',
    goal: 'Preparation',
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
        exerciseId: 'warmup_shoulder_prep',
        name: 'Rotations + ouverture epaules',
        unit: 'reps',
        sets: 2,
        startTarget: 12,
        capTarget: 20,
        step: 2,
        instructions: 'Cercles de bras et ouvertures pour preparer tirage et pecs.',
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

export const CAL_STATS: readonly CalStat[] = ['DOS', 'PECS', 'BRAS', 'ABDOS'];

export const CAL_STAT_LABEL: Record<CalStat, string> = {
  DOS: 'Dos',
  PECS: 'Pectoraux',
  BRAS: 'Bras',
  ABDOS: 'Abdos',
};
