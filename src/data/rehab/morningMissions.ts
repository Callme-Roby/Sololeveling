import type { RehabCategory } from './ankleRehab';

/**
 * Missions du matin revelees par la sonnerie. Rotation deterministe par jour.
 * Orientees reeducation cheville + cardio de recuperation.
 * A enrichir avec le contenu kine de l'utilisateur.
 */
export interface MorningMission {
  id: string;
  title: string;
  detail: string;
  focus: RehabCategory;
  exerciseIds: string[];
  estimatedMinutes: number;
}

export const MORNING_MISSIONS: readonly MorningMission[] = [
  {
    id: 'mm_recovery_walk',
    title: 'Reveil en douceur',
    detail:
      'Marche active 20 min + mobilite cheville. Note ta douleur au retour.',
    focus: 'cardio_recovery',
    exerciseIds: ['recovery_walk', 'ankle_circles', 'dorsiflexion_stretch'],
    estimatedMinutes: 30,
  },
  {
    id: 'mm_jog_test',
    title: 'Test de la cheville',
    detail:
      'Footing test 10 min tres lent. Si douleur > 3/10, tu t\'arretes et tu notes.',
    focus: 'cardio_recovery',
    exerciseIds: ['recovery_jog_test', 'calf_raise_double'],
    estimatedMinutes: 20,
  },
  {
    id: 'mm_strength',
    title: 'Forge de la cheville',
    detail:
      'Renforcement : mollets + elastique eversion/inversion. Controle, pas de douleur.',
    focus: 'strength',
    exerciseIds: [
      'calf_raise_double',
      'resistance_band_evert',
      'resistance_band_invert',
    ],
    estimatedMinutes: 20,
  },
  {
    id: 'mm_balance',
    title: 'Trouver l\'equilibre',
    detail:
      'Proprioception : equilibre unipodal + surface instable. Reveille les capteurs.',
    focus: 'proprioception',
    exerciseIds: ['balance_single_open', 'balance_cushion', 'ankle_alphabet'],
    estimatedMinutes: 15,
  },
  {
    id: 'mm_mobility',
    title: 'Deverrouiller',
    detail:
      'Mobilite complete cheville : cercles, alphabet, dorsiflexion. Ideal jour de repos.',
    focus: 'mobility',
    exerciseIds: ['ankle_circles', 'ankle_alphabet', 'dorsiflexion_stretch'],
    estimatedMinutes: 12,
  },
  {
    id: 'mm_jog_z2',
    title: 'Course de recuperation',
    detail:
      'Footing zone 2, 20 min, allure conversation. GPS pour suivre. Ecoute la cheville.',
    focus: 'cardio_recovery',
    exerciseIds: ['recovery_jog_z2', 'dorsiflexion_stretch'],
    estimatedMinutes: 25,
  },
  {
    id: 'mm_full',
    title: 'Seance complete',
    detail:
      'Mobilite + renforcement + equilibre. Le combo qui reconstruit la cheville.',
    focus: 'strength',
    exerciseIds: [
      'ankle_circles',
      'calf_raise_single',
      'balance_single_open',
    ],
    estimatedMinutes: 25,
  },
];

const dayOfYear = (d: Date): number => {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/** Mission deterministe pour une date donnee (rotation stable). */
export const missionForDate = (date: Date = new Date()): MorningMission => {
  const idx = dayOfYear(date) % MORNING_MISSIONS.length;
  return MORNING_MISSIONS[idx];
};
