/**
 * Socle de contenu reeducation cheville droite.
 *
 * A COMPLETER avec le contenu kine fourni progressivement par l'utilisateur.
 * Chaque exercice est volontairement simple et sur pour un debut de
 * reeducation. Categories : mobilite, renforcement, proprioception,
 * cardio de recuperation.
 */

export type RehabCategory =
  | 'mobility'
  | 'strength'
  | 'proprioception'
  | 'cardio_recovery';

export type RehabUnit = 'reps' | 'seconds' | 'minutes' | 'sets';

export interface RehabExercise {
  id: string;
  name: string;
  category: RehabCategory;
  unit: RehabUnit;
  sets?: number;
  target?: number;
  perSide?: boolean;
  ankleFocus: boolean;
  instructions: string;
  caution?: string;
}

export const REHAB_CATEGORY_LABEL: Record<RehabCategory, string> = {
  mobility: 'Mobilite',
  strength: 'Renforcement',
  proprioception: 'Proprioception',
  cardio_recovery: 'Cardio de recuperation',
};

export const ANKLE_REHAB_EXERCISES: readonly RehabExercise[] = [
  {
    id: 'ankle_circles',
    name: 'Cercles de cheville',
    category: 'mobility',
    unit: 'reps',
    sets: 2,
    target: 15,
    perSide: true,
    ankleFocus: true,
    instructions:
      'Assis, jambe tendue. Dessine des cercles lents avec le pied, dans les deux sens.',
  },
  {
    id: 'ankle_alphabet',
    name: 'Alphabet du pied',
    category: 'mobility',
    unit: 'reps',
    sets: 1,
    target: 1,
    perSide: true,
    ankleFocus: true,
    instructions:
      'Ecris l\'alphabet en l\'air avec le gros orteil. Mouvement lent et controle.',
  },
  {
    id: 'dorsiflexion_stretch',
    name: 'Etirement dorsiflexion (genou au mur)',
    category: 'mobility',
    unit: 'seconds',
    sets: 3,
    target: 30,
    perSide: true,
    ankleFocus: true,
    instructions:
      'Pied a quelques cm du mur, avance le genou vers le mur sans decoller le talon.',
  },
  {
    id: 'calf_raise_double',
    name: 'Elevations mollets (2 jambes)',
    category: 'strength',
    unit: 'reps',
    sets: 3,
    target: 15,
    perSide: false,
    ankleFocus: true,
    instructions: 'Monte sur la pointe des pieds lentement, redescends controle.',
    caution: 'Arrete si douleur vive.',
  },
  {
    id: 'calf_raise_single',
    name: 'Elevations mollet (1 jambe)',
    category: 'strength',
    unit: 'reps',
    sets: 3,
    target: 12,
    perSide: true,
    ankleFocus: true,
    instructions:
      'Sur une jambe, monte sur la pointe. Tiens-toi a un support si besoin.',
    caution: 'A introduire quand la cheville supporte bien le double appui.',
  },
  {
    id: 'resistance_band_evert',
    name: 'Eversion elastique',
    category: 'strength',
    unit: 'reps',
    sets: 3,
    target: 15,
    perSide: true,
    ankleFocus: true,
    instructions:
      'Elastique autour de l\'avant-pied, pousse le pied vers l\'exterieur contre la resistance.',
  },
  {
    id: 'resistance_band_invert',
    name: 'Inversion elastique',
    category: 'strength',
    unit: 'reps',
    sets: 3,
    target: 15,
    perSide: true,
    ankleFocus: true,
    instructions:
      'Elastique autour de l\'avant-pied, ramene le pied vers l\'interieur contre la resistance.',
  },
  {
    id: 'balance_single_open',
    name: 'Equilibre unipodal yeux ouverts',
    category: 'proprioception',
    unit: 'seconds',
    sets: 3,
    target: 30,
    perSide: true,
    ankleFocus: true,
    instructions: 'Tiens en equilibre sur la cheville droite, regard fixe.',
  },
  {
    id: 'balance_single_closed',
    name: 'Equilibre unipodal yeux fermes',
    category: 'proprioception',
    unit: 'seconds',
    sets: 3,
    target: 20,
    perSide: true,
    ankleFocus: true,
    instructions: 'Meme chose, yeux fermes. Pres d\'un mur pour te rattraper.',
    caution: 'A introduire quand l\'equilibre yeux ouverts est stable.',
  },
  {
    id: 'balance_cushion',
    name: 'Equilibre sur surface instable',
    category: 'proprioception',
    unit: 'seconds',
    sets: 3,
    target: 30,
    perSide: true,
    ankleFocus: true,
    instructions: 'Sur un coussin/serviette pliee, cherche la stabilite.',
  },
  {
    id: 'recovery_walk',
    name: 'Marche active de recuperation',
    category: 'cardio_recovery',
    unit: 'minutes',
    target: 20,
    ankleFocus: false,
    instructions: 'Marche a allure soutenue mais confortable, terrain plat.',
  },
  {
    id: 'recovery_jog_test',
    name: 'Footing test cheville',
    category: 'cardio_recovery',
    unit: 'minutes',
    target: 10,
    ankleFocus: true,
    instructions:
      'Footing tres lent. Objectif : sentir si la cheville tient, pas la performance.',
    caution: 'Douleur > 3/10 : tu t\'arretes et tu notes.',
  },
  {
    id: 'recovery_jog_z2',
    name: 'Footing recuperation zone 2',
    category: 'cardio_recovery',
    unit: 'minutes',
    target: 20,
    ankleFocus: false,
    instructions: 'Allure conversation, respiration facile. GPS pour le suivi.',
  },
];

export const REHAB_BY_ID = Object.freeze(
  ANKLE_REHAB_EXERCISES.reduce<Record<string, RehabExercise>>((acc, e) => {
    acc[e.id] = e;
    return acc;
  }, {}),
);

export const getRehabExercise = (id: string): RehabExercise | undefined =>
  REHAB_BY_ID[id];
