import type { Workout } from '@/domain/types';

const w = (
  weekNumber: number,
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  type: Workout['type'],
  title: string,
  planned: Workout['plannedExercises'],
): Workout => ({
  id: `w${weekNumber}d${dayOfWeek}`,
  weekNumber,
  dayOfWeek,
  type,
  title,
  plannedExercises: planned,
  isBossDay: type === 'BOSS',
});

export const WORKOUTS: readonly Workout[] = [
  w(1, 1, 'AGI_GRP', 'Lundi - AGI + GRP', [
    { exerciseId: 'broad_jump', sets: 3, repsPerSet: 3, notes: 'Sub-max, qualite' },
    { exerciseId: 'jump_squat', sets: 3, repsPerSet: 6 },
    { exerciseId: 'sprint_short', sets: 3, distanceMPerSet: 15, notes: 'Sub-max' },
    { exerciseId: 'hang_towel', sets: 3, durationSecPerSet: 10, perSide: true },
  ]),
  w(1, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 25, notes: 'Rythme conversation' },
  ]),
  w(1, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 8, notes: 'Cote douce' },
    { exerciseId: 'atg_split_squat', sets: 3, repsPerSet: 6, perSide: true, notes: 'Descente lente, poids du corps' },
    { exerciseId: 'sissy_squat', sets: 3, repsPerSet: 5, notes: 'Assistes' },
    { exerciseId: 'farmer_carry', sets: 3, distanceMPerSet: 20, notes: 'Modere' },
    { exerciseId: 'calf_raise_unilateral', sets: 3, repsPerSet: 12, perSide: true },
  ]),
  w(1, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 5, durationSecPerSet: 20, notes: '20s travail / 40s repos. Burpees ou jump squats' },
    { exerciseId: 'jump_rope', sets: 2, durationSecPerSet: 60, notes: 'Finisher' },
  ]),
  w(1, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'pogo_jump', sets: 3, durationSecPerSet: 15 },
    { exerciseId: 'step_up', sets: 3, repsPerSet: 6, perSide: true, notes: 'Controles' },
    { exerciseId: 'reverse_nordic', sets: 3, repsPerSet: 5, notes: 'Assiste' },
    { exerciseId: 'balance_unipedal_open', sets: 3, durationSecPerSet: 30, perSide: true },
    { exerciseId: 'balance_unipedal_closed', sets: 3, durationSecPerSet: 30, perSide: true },
  ]),
  w(1, 6, 'BOSS', "Samedi - Donjon de l'Eveil", []),
  w(1, 7, 'REST', 'Dimanche - Recup active', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 60, notes: 'Cumule' },
    { exerciseId: 'walk', totalDurationMin: 20 },
  ]),

  w(2, 1, 'AGI_GRP', 'Lundi - AGI + GRP', [
    { exerciseId: 'broad_jump', sets: 4, repsPerSet: 4 },
    { exerciseId: 'jump_squat', sets: 3, repsPerSet: 8 },
    { exerciseId: 'sprint_short', sets: 4, distanceMPerSet: 20 },
    { exerciseId: 'hang_towel', sets: 3, durationSecPerSet: 15, perSide: true },
  ]),
  w(2, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 30 },
  ]),
  w(2, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 10 },
    { exerciseId: 'atg_split_squat', sets: 3, repsPerSet: 8, perSide: true },
    { exerciseId: 'sissy_squat', sets: 3, repsPerSet: 6 },
    { exerciseId: 'farmer_carry', sets: 3, distanceMPerSet: 30 },
    { exerciseId: 'calf_raise_unilateral', sets: 3, repsPerSet: 15, perSide: true },
  ]),
  w(2, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 6, durationSecPerSet: 25, notes: '25s travail / 35s repos' },
    { exerciseId: 'jump_rope', sets: 3, durationSecPerSet: 60, notes: 'Finisher' },
  ]),
  w(2, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'pogo_jump', sets: 3, durationSecPerSet: 20 },
    { exerciseId: 'step_up', sets: 3, repsPerSet: 8, perSide: true },
    { exerciseId: 'reverse_nordic', sets: 3, repsPerSet: 6 },
    { exerciseId: 'balance_unipedal_closed', sets: 3, durationSecPerSet: 30, perSide: true },
  ]),
  w(2, 6, 'BOSS', 'Samedi - Donjon des Premiers Pas', []),
  w(2, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 90, notes: 'Cumule' },
  ]),

  w(3, 1, 'AGI_GRP', "Lundi - AGI + GRP", [
    { exerciseId: 'broad_jump', sets: 5, repsPerSet: 5, notes: '+ 3x3 max distance' },
    { exerciseId: 'jump_squat', sets: 4, repsPerSet: 10 },
    { exerciseId: 'sprint_short', sets: 6, distanceMPerSet: 20 },
    { exerciseId: 'hang_towel', sets: 4, durationSecPerSet: 20, perSide: true },
  ]),
  w(3, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 40 },
  ]),
  w(3, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 15 },
    { exerciseId: 'atg_split_squat', sets: 4, repsPerSet: 8, perSide: true },
    { exerciseId: 'sissy_squat', sets: 3, repsPerSet: 10 },
    { exerciseId: 'farmer_carry', sets: 4, distanceMPerSet: 40 },
    { exerciseId: 'calf_raise_deficit', sets: 3, repsPerSet: 15, perSide: true },
  ]),
  w(3, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 8, durationSecPerSet: 30, notes: '30s burpees / 30s repos' },
    { exerciseId: 'jump_rope', sets: 4, durationSecPerSet: 90, notes: 'Finisher' },
  ]),
  w(3, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'pogo_jump', sets: 4, durationSecPerSet: 25 },
    { exerciseId: 'step_up', sets: 4, repsPerSet: 10, perSide: true },
    { exerciseId: 'reverse_nordic', sets: 4, repsPerSet: 8 },
    { exerciseId: 'balance_dynamic', sets: 3, durationSecPerSet: 30, perSide: true, notes: 'Lancer balle' },
  ]),
  w(3, 6, 'BOSS', 'Samedi - Donjon de la Perseverance', []),
  w(3, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 110, notes: 'Cumule' },
  ]),

  w(4, 1, 'AGI_GRP', 'Lundi - Decharge', [
    { exerciseId: 'broad_jump', sets: 3, repsPerSet: 5 },
    { exerciseId: 'jump_squat', sets: 3, repsPerSet: 8 },
    { exerciseId: 'hang_towel', sets: 3, durationSecPerSet: 15 },
  ]),
  w(4, 2, 'VIT_Z2', 'Mardi - Footing relax', [
    { exerciseId: 'footing_z2', totalDurationMin: 30 },
  ]),
  w(4, 3, 'STR_GRP', 'Mercredi - Decharge', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 10 },
    { exerciseId: 'atg_split_squat', sets: 3, repsPerSet: 6, perSide: true },
  ]),
  w(4, 4, 'REST', 'Jeudi - Repos ou marche', [
    { exerciseId: 'walk', totalDurationMin: 30, notes: 'Optionnel' },
  ]),
  w(4, 5, 'AGI_STR', 'Vendredi - Decharge', [
    { exerciseId: 'pogo_jump', sets: 3, durationSecPerSet: 15 },
    { exerciseId: 'reverse_nordic', sets: 3, repsPerSet: 5 },
    { exerciseId: 'balance_unipedal_closed', sets: 3, durationSecPerSet: 30, perSide: true },
  ]),
  w(4, 6, 'BOSS', 'Samedi - Donjon de la Porte D', []),
  w(4, 7, 'REST', 'Dimanche - Recup + Bilan', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 90 },
  ]),

  w(5, 1, 'AGI_GRP', 'Lundi - AGI + GRP', [
    { exerciseId: 'broad_jump', sets: 5, repsPerSet: 5, notes: 'Max' },
    { exerciseId: 'box_jump', sets: 4, repsPerSet: 5 },
    { exerciseId: 'sprint_short', sets: 6, distanceMPerSet: 30 },
    { exerciseId: 'hang_towel', sets: 3, durationSecPerSet: 15, notes: 'Leste' },
  ]),
  w(5, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 45 },
  ]),
  w(5, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 15, notes: 'Sac 5kg' },
    { exerciseId: 'atg_split_squat', sets: 4, repsPerSet: 8, perSide: true, notes: 'Leste' },
    { exerciseId: 'sissy_squat', sets: 4, repsPerSet: 8 },
    { exerciseId: 'farmer_carry', sets: 3, notes: 'Max distance par serie' },
  ]),
  w(5, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 8, durationSecPerSet: 40, notes: '40s/20s, alterne burpees/mountain climbers/squat jumps' },
  ]),
  w(5, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'depth_jump', sets: 4, repsPerSet: 4, notes: "Depuis marche, atterrir vite" },
    { exerciseId: 'step_up', sets: 4, repsPerSet: 8, perSide: true, notes: 'Leste' },
    { exerciseId: 'reverse_nordic', sets: 4, repsPerSet: 8 },
    { exerciseId: 'unilateral_bound', sets: 3, repsPerSet: 8, perSide: true },
  ]),
  w(5, 6, 'BOSS', 'Samedi - Donjon du Souffle Court', []),
  w(5, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 150 },
  ]),

  w(6, 1, 'AGI_GRP', 'Lundi - AGI + GRP', [
    { exerciseId: 'broad_jump', sets: 6, repsPerSet: 5 },
    { exerciseId: 'box_jump', sets: 5, repsPerSet: 5 },
    { exerciseId: 'sprint_short', sets: 8, distanceMPerSet: 30 },
    { exerciseId: 'hang_towel', sets: 4, durationSecPerSet: 15, notes: 'Leste' },
  ]),
  w(6, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 50, notes: 'OU 40 min velo soutenu' },
  ]),
  w(6, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 18, notes: 'Leste' },
    { exerciseId: 'atg_split_squat', sets: 4, repsPerSet: 10, perSide: true, notes: 'Leste' },
    { exerciseId: 'sissy_squat', sets: 4, repsPerSet: 10 },
    { exerciseId: 'farmer_carry', sets: 4, notes: 'Lourd' },
    { exerciseId: 'calf_raise_deficit', sets: 3, repsPerSet: 20, perSide: true },
  ]),
  w(6, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 10, durationSecPerSet: 30, notes: '30s/30s, varie burpees/jump squats/mountain climbers' },
  ]),
  w(6, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'depth_jump', sets: 4, repsPerSet: 5 },
    { exerciseId: 'unilateral_bound', sets: 4, repsPerSet: 8, perSide: true },
    { exerciseId: 'reverse_nordic', sets: 4, repsPerSet: 10 },
    { exerciseId: 'balance_dynamic', sets: 3, durationSecPerSet: 40, perSide: true, notes: 'Yeux fermes + perturbation' },
  ]),
  w(6, 6, 'BOSS', "Samedi - Donjon des Genoux d'Acier", []),
  w(6, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 160 },
  ]),

  w(7, 1, 'AGI_GRP', 'Lundi - AGI + GRP', [
    { exerciseId: 'broad_jump', sets: 6, repsPerSet: 5 },
    { exerciseId: 'box_jump', sets: 5, repsPerSet: 1, notes: '1 jump -> 20m sprint, enchaine' },
    { exerciseId: 'sprint_short', sets: 5, distanceMPerSet: 20, notes: 'Enchaine apres box jump' },
    { exerciseId: 'hang_towel', sets: 4, durationSecPerSet: 20, notes: 'Leste' },
  ]),
  w(7, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 55 },
  ]),
  w(7, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 20, notes: 'Leste' },
    { exerciseId: 'atg_split_squat', sets: 5, repsPerSet: 8, perSide: true, notes: 'Leste' },
    { exerciseId: 'sissy_squat', sets: 4, repsPerSet: 8, notes: 'Lestes' },
    { exerciseId: 'farmer_carry', sets: 4, distanceMPerSet: 60, notes: 'Lourd long' },
  ]),
  w(7, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 10, durationSecPerSet: 40, notes: '40s/20s' },
    { exerciseId: 'burpee', totalReps: 50, notes: 'Finisher chrono' },
  ]),
  w(7, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'depth_jump', sets: 5, repsPerSet: 4 },
    { exerciseId: 'unilateral_bound', sets: 4, repsPerSet: 10, perSide: true },
    { exerciseId: 'reverse_nordic', sets: 3, repsPerSet: 8, notes: 'Leste' },
    { exerciseId: 'balance_unipedal_closed', sets: 3, durationSecPerSet: 45, perSide: true },
  ]),
  w(7, 6, 'BOSS', "Samedi - Donjon de l'Endurance", []),
  w(7, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 170 },
  ]),

  w(8, 1, 'AGI_GRP', 'Lundi - Decharge', [
    { exerciseId: 'broad_jump', sets: 3, repsPerSet: 5 },
    { exerciseId: 'box_jump', sets: 3, repsPerSet: 3 },
    { exerciseId: 'hang_towel', sets: 3, durationSecPerSet: 15, notes: 'Leger' },
  ]),
  w(8, 2, 'VIT_Z2', 'Mardi - Footing relax', [
    { exerciseId: 'footing_z2', totalDurationMin: 30 },
  ]),
  w(8, 3, 'STR_GRP', 'Mercredi - Decharge', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 10 },
    { exerciseId: 'atg_split_squat', sets: 3, repsPerSet: 6, perSide: true },
  ]),
  w(8, 4, 'REST', 'Jeudi - Marche', [
    { exerciseId: 'walk', totalDurationMin: 40 },
  ]),
  w(8, 5, 'AGI_STR', 'Vendredi - Decharge', [
    { exerciseId: 'pogo_jump', sets: 3, durationSecPerSet: 15 },
  ]),
  w(8, 6, 'BOSS', 'Samedi - Donjon de la Porte C', []),
  w(8, 7, 'REST', 'Dimanche - Bilan', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 150 },
  ]),

  w(9, 1, 'AGI_GRP', 'Lundi - AGI + GRP', [
    { exerciseId: 'broad_jump', sets: 6, repsPerSet: 5, notes: 'Max' },
    { exerciseId: 'unilateral_bound', sets: 6, repsPerSet: 3, notes: '3 sauts -> sprint 30m' },
    { exerciseId: 'sprint_short', sets: 6, distanceMPerSet: 30, notes: 'Enchaine' },
    { exerciseId: 'hang_towel', sets: 4, durationSecPerSet: 20, notes: 'Leste' },
    { exerciseId: 'pinch_grip', sets: 3, durationSecPerSet: 30 },
  ]),
  w(9, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 60, notes: 'OU velo' },
  ]),
  w(9, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 25, notes: 'Leste' },
    { exerciseId: 'atg_split_squat', sets: 5, repsPerSet: 10, perSide: true, notes: 'Leste' },
    { exerciseId: 'sissy_squat', sets: 4, repsPerSet: 10, notes: 'Lestes' },
    { exerciseId: 'farmer_carry', sets: 5, distanceMPerSet: 60, notes: 'Tres lourd' },
  ]),
  w(9, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 12, durationSecPerSet: 30, notes: '30s/30s' },
    { exerciseId: 'sprint_short', sets: 6, durationSecPerSet: 30, notes: 'Sprint colline finisher' },
  ]),
  w(9, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'depth_jump', sets: 5, repsPerSet: 3, notes: 'Haut' },
    { exerciseId: 'unilateral_bound', sets: 5, repsPerSet: 4, perSide: true, notes: 'Saut + sprint' },
    { exerciseId: 'reverse_nordic', sets: 4, repsPerSet: 8, notes: 'Leste' },
    { exerciseId: 'balance_dynamic', sets: 3, durationSecPerSet: 60, perSide: true },
  ]),
  w(9, 6, 'BOSS', 'Samedi - Donjon des Lames', []),
  w(9, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 200 },
  ]),

  w(10, 1, 'AGI_GRP', 'Lundi - Complexe explosif', [
    { exerciseId: 'broad_jump', sets: 5, repsPerSet: 3, notes: 'Complexe x5: 3 broad + 3 box + sprint 30m' },
    { exerciseId: 'box_jump', sets: 5, repsPerSet: 3, notes: 'Voir complexe' },
    { exerciseId: 'sprint_short', sets: 5, distanceMPerSet: 30, notes: 'Voir complexe' },
    { exerciseId: 'hang_towel', sets: 5, durationSecPerSet: 20, notes: 'Leste' },
    { exerciseId: 'pinch_grip', sets: 4, durationSecPerSet: 30 },
  ]),
  w(10, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 65 },
  ]),
  w(10, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 25, notes: 'Leste' },
    { exerciseId: 'atg_split_squat', sets: 5, repsPerSet: 12, perSide: true, notes: 'Leste' },
    { exerciseId: 'sissy_squat', sets: 5, repsPerSet: 8, notes: 'Lestes' },
    { exerciseId: 'farmer_carry', sets: 5, distanceMPerSet: 80, notes: 'Monstrueux' },
  ]),
  w(10, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 6, durationSecPerSet: 60, notes: '1 min max / 1 min repos' },
    { exerciseId: 'burpee', totalReps: 75, notes: 'Finisher chrono' },
  ]),
  w(10, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'depth_jump', sets: 5, repsPerSet: 4, notes: 'Haut' },
    { exerciseId: 'sprint_short', sets: 5, distanceMPerSet: 30, notes: 'Depart couche' },
    { exerciseId: 'reverse_nordic', sets: 4, repsPerSet: 10, notes: 'Leste' },
    { exerciseId: 'balance_dynamic', sets: 3, durationSecPerSet: 60, perSide: true, notes: 'Avec perturbation' },
  ]),
  w(10, 6, 'BOSS', 'Samedi - Donjon de la Forge Rouge', []),
  w(10, 7, 'REST', 'Dimanche - Recup', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 210 },
  ]),

  w(11, 1, 'AGI_GRP', 'Lundi - Pic explosif', [
    { exerciseId: 'broad_jump', sets: 5, repsPerSet: 5, notes: 'Max' },
    { exerciseId: 'box_jump', sets: 8, repsPerSet: 1, notes: 'Complexes 1 broad -> 1 box -> sprint x8' },
    { exerciseId: 'sprint_short', sets: 8, distanceMPerSet: 30, notes: 'Voir complexe' },
    { exerciseId: 'hang_towel', sets: 3, durationSecPerSet: 30, notes: 'Max leste' },
    { exerciseId: 'pinch_grip', sets: 4, durationSecPerSet: 30, notes: 'Leste' },
  ]),
  w(11, 2, 'VIT_Z2', 'Mardi - VIT zone 2', [
    { exerciseId: 'footing_z2', totalDurationMin: 70, notes: 'Facile' },
  ]),
  w(11, 3, 'STR_GRP', 'Mercredi - STR + GRP', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 30, notes: 'Lourd' },
    { exerciseId: 'atg_split_squat', sets: 4, repsPerSet: 10, perSide: true, notes: 'Max leste' },
    { exerciseId: 'sissy_squat', sets: 5, repsPerSet: 10, notes: 'Lestes' },
    { exerciseId: 'farmer_carry', sets: 4, notes: 'Max poids' },
  ]),
  w(11, 4, 'HIIT', 'Jeudi - HIIT', [
    { exerciseId: 'hiit_round', sets: 12, durationSecPerSet: 40, notes: '40s/20s' },
    { exerciseId: 'sprint_long', sets: 3, distanceMPerSet: 100, notes: 'Finisher' },
  ]),
  w(11, 5, 'AGI_STR', 'Vendredi - AGI + STR', [
    { exerciseId: 'depth_jump', sets: 6, repsPerSet: 3, notes: 'Haut' },
    { exerciseId: 'unilateral_bound', sets: 5, repsPerSet: 10, perSide: true, notes: 'Maxi' },
    { exerciseId: 'reverse_nordic', sets: 4, repsPerSet: 10, notes: 'Max' },
    { exerciseId: 'balance_unipedal_closed', sets: 3, durationSecPerSet: 60, perSide: true },
  ]),
  w(11, 6, 'BOSS', 'Samedi - Donjon du Sanctuaire', []),
  w(11, 7, 'REST', 'Dimanche - Recup reparatrice', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 220 },
  ]),

  w(12, 1, 'AGI_GRP', 'Lundi - Affutage', [
    { exerciseId: 'broad_jump', sets: 4, repsPerSet: 5 },
    { exerciseId: 'box_jump', sets: 4, repsPerSet: 5 },
    { exerciseId: 'sprint_short', sets: 4, distanceMPerSet: 30, notes: 'Qualite' },
  ]),
  w(12, 2, 'VIT_Z2', 'Mardi - Footing relax', [
    { exerciseId: 'footing_z2', totalDurationMin: 40 },
  ]),
  w(12, 3, 'STR_GRP', 'Mercredi - Affutage', [
    { exerciseId: 'backward_walk_hill', totalDurationMin: 15 },
    { exerciseId: 'atg_split_squat', sets: 3, repsPerSet: 8, perSide: true },
  ]),
  w(12, 4, 'REST', 'Jeudi - Repos OU marche', [
    { exerciseId: 'walk', totalDurationMin: 30, notes: 'Optionnel' },
  ]),
  w(12, 5, 'REST', 'Vendredi - Mobilite + visualisation', [
    { exerciseId: 'hang_passive', sets: 1, durationSecPerSet: 200 },
  ]),
  w(12, 6, 'BOSS', 'Samedi - Donjon de la Tour Brisee', []),
  w(12, 7, 'REST', 'Dimanche - Recup totale + Bilan', []),
];

export const getWorkoutsForWeek = (weekNumber: number): readonly Workout[] =>
  WORKOUTS.filter((w) => w.weekNumber === weekNumber);

export const getWorkout = (
  weekNumber: number,
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7,
): Workout | undefined =>
  WORKOUTS.find(
    (w) => w.weekNumber === weekNumber && w.dayOfWeek === dayOfWeek,
  );
