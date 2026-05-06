import type { HiddenDungeon } from '@/domain/types';

export const HIDDEN_DUNGEONS: readonly HiddenDungeon[] = [
  {
    id: 'hd_aube',
    name: "Donjon de l'Aube",
    emoji: '\u{1F305}',
    trigger: 'd6_dawn',
    description: 'Le Systeme te juge sur ta capacite a voler des heures a la nuit.',
    keyMissionsTemplate: [
      { id: 'aube_lever_avant_soleil', label: 'Se lever avant le lever du soleil 2 jours d\'affilee' },
      { id: 'aube_quetes_avant_8h', label: 'Completer les 4 quetes journalieres avant 8h les deux matins' },
      { id: 'aube_eau_500ml', label: 'Boire 500ml d\'eau dans les 5 min apres le reveil' },
    ],
    dungeonObjective: 'Faire une seance principale complete avant le lever du soleil, sans cafe avant.',
    rewardTitle: 'Premier Rayon',
    rewardXp: { VIT: 50, STR: 50 },
    rare: false,
    weatherBonus: false,
  },
  {
    id: 'hd_pluie',
    name: 'Donjon de la Pluie',
    emoji: '\u{1F327}\u{FE0F}',
    trigger: 'rain',
    description: "Le Systeme t'envoie le mauvais temps. Il regarde si tu sors quand meme.",
    keyMissionsTemplate: [
      { id: 'pluie_burpees_50', label: 'Faire 50 burpees sous la pluie (5 min de pluie suffisent)' },
      { id: 'pluie_hang', label: 'Realiser un hang complet sous la pluie' },
      { id: 'pluie_marche_30', label: 'Marcher 30 min sous la pluie sans capuche' },
    ],
    dungeonObjective: 'Une seance principale complete, integralement sous la pluie battante.',
    rewardTitle: 'Indomptable',
    rewardXp: { STR: 75, VIT: 25, AGI: 25, GRP: 25 },
    rare: false,
    weatherBonus: false,
  },
  {
    id: 'hd_silence',
    name: 'Donjon du Silence',
    emoji: '\u{1F92B}',
    trigger: 'd6_silence',
    description: "Le Systeme coupe le son. Il veut savoir si tu peux t'entrainer avec toi-meme.",
    keyMissionsTemplate: [
      { id: 'silence_med_2x10', label: '2 meditations de 10 min (assis, yeux fermes, respiration)' },
      { id: 'silence_marche_30', label: '1 marche de 30 min sans aucun ecouteur ni telephone' },
      { id: 'silence_quetes_attention', label: '4 quetes journalieres en pleine attention (pas de musique, pas d\'ecran)' },
    ],
    dungeonObjective: 'Seance principale complete en silence absolu - pas de musique, pas de podcast, telephone en mode avion.',
    rewardTitle: 'Present',
    rewardXp: { VIT: 50, AGI: 50, STR: 50, GRP: 50 },
    rare: false,
    weatherBonus: false,
  },
  {
    id: 'hd_marches',
    name: 'Donjon des Mille Marches',
    emoji: '\u{1FA9C}',
    trigger: 'd6_thousand_steps',
    description: 'Le Systeme te montre une tour. Il attend de voir si tu montes.',
    keyMissionsTemplate: [
      { id: 'marches_3x20', label: '3 sessions de 20 etages d\'escaliers' },
      { id: 'marches_step_ups_2j', label: '100 step-ups par jour pendant 2 jours' },
      { id: 'marches_terrain_30', label: 'Une marche de 30 min en terrain accidente' },
    ],
    dungeonObjective: '100 etages d\'escaliers en une seule session continue, a intensite elevee.',
    rewardTitle: 'Ascensionniste',
    rewardXp: { VIT: 75, STR: 50 },
    rare: false,
    weatherBonus: false,
  },
  {
    id: 'hd_voyageur',
    name: 'Donjon du Voyageur',
    emoji: '\u{2708}\u{FE0F}',
    trigger: 'traveler',
    description: 'Le Systeme te deracine. Il regarde si la discipline te suit.',
    keyMissionsTemplate: [
      { id: 'voyageur_quetes_inhabituel', label: 'Completer les 4 quetes journalieres dans un lieu inhabituel' },
      { id: 'voyageur_seance_impro', label: 'Une seance "improvisation" avec uniquement ce qui est disponible' },
      { id: 'voyageur_hang_nouveau', label: 'Un hang trouve dans un endroit nouveau (arbre, agres, structure)' },
    ],
    dungeonObjective: 'Seance principale complete loin de chez toi, sans materiel habituel, en utilisant l\'environnement.',
    rewardTitle: 'Sans Frontiere',
    rewardXp: { VIT: 50, AGI: 50, STR: 50, GRP: 50 },
    rare: false,
    weatherBonus: false,
  },
  {
    id: 'hd_pleine_lune',
    name: 'Donjon de la Pleine Lune',
    emoji: '\u{1F319}',
    trigger: 'full_moon',
    description: 'Le Systeme ouvre une porte qui ne s\'ouvre que 12 fois par an.',
    keyMissionsTemplate: [
      { id: 'lune_hang_2_nuits', label: 'Hang sous la lune 2 nuits d\'affilee (30s suffisent)' },
      { id: 'lune_quete_22h', label: 'Une quete journaliere effectuee apres 22h' },
      { id: 'lune_marche_silencieuse', label: 'Marche silencieuse de 20 min la nuit' },
    ],
    dungeonObjective: 'Seance principale complete la nuit, dans un parc tranquille, a la lumiere de la lune.',
    rewardTitle: 'Ombre Portee',
    rewardXp: { AGI: 75, GRP: 50 },
    rare: true,
    weatherBonus: false,
  },
  {
    id: 'hd_givre',
    name: 'Donjon du Givre',
    emoji: '\u{1F976}',
    trigger: 'frost',
    description: 'Apparition: temperature < 5°C prevue sur 24h+.',
    keyMissionsTemplate: [
      { id: 'givre_quetes_exterieur', label: 'Completer les 4 quetes journalieres en exterieur par le froid 2 jours d\'affilee' },
      { id: 'givre_hang_dehors', label: '1 hang dehors par moins de 5°C' },
      { id: 'givre_courir_z2_froid', label: 'Courir 20 min Z2 par temps froid sans surchauffer' },
    ],
    dungeonObjective: 'Seance principale complete en exterieur par le froid (equipement adapte). Pas de saut si gel/neige.',
    rewardTitle: 'Coeur Glace',
    rewardXp: { STR: 50, VIT: 50 },
    rare: true,
    weatherBonus: true,
  },
  {
    id: 'hd_canicule',
    name: 'Donjon de la Canicule',
    emoji: '\u{1F525}',
    trigger: 'heat',
    description: 'Apparition: temperature > 30°C prevue dans la journee.',
    keyMissionsTemplate: [
      { id: 'canicule_3l_eau', label: 'Boire 3 litres d\'eau / jour mesures' },
      { id: 'canicule_seance_avant_8h', label: '1 seance principale avant 8h (avant la chaleur)' },
      { id: 'canicule_quete_apres_20h', label: '1 quete journaliere apres 20h (a la fraiche)' },
    ],
    dungeonObjective: 'Seance complete au plus chaud - intensite reduite, hydratation max, ombre quand possible.',
    rewardTitle: 'Forge Solaire',
    rewardXp: { VIT: 75 },
    rare: true,
    weatherBonus: true,
  },
  {
    id: 'hd_tempete',
    name: 'Donjon de la Tempete',
    emoji: '\u{1F32A}\u{FE0F}',
    trigger: 'storm',
    description: 'Apparition: alerte vent >50 km/h ou meteo orange. JAMAIS si orage electrique, vents >80 km/h ou alerte rouge.',
    keyMissionsTemplate: [
      { id: 'tempete_marche_30', label: 'Marche de 30 min dans le vent' },
      { id: 'tempete_burpees_50', label: '50 burpees dehors avec vent fort dans la face' },
      { id: 'tempete_hang_vent', label: '1 hang en exterieur tenu malgre le vent' },
    ],
    dungeonObjective: 'Seance complete dehors malgre la tempete (jamais sous orage electrique).',
    rewardTitle: 'Oeil du Cyclone',
    rewardXp: { AGI: 50, STR: 50 },
    rare: true,
    weatherBonus: true,
  },
];

export const HIDDEN_DUNGEONS_BY_ID = Object.freeze(
  HIDDEN_DUNGEONS.reduce<Record<string, HiddenDungeon>>((acc, d) => {
    acc[d.id] = d;
    return acc;
  }, {}),
);

export const getHiddenDungeon = (id: string): HiddenDungeon | undefined =>
  HIDDEN_DUNGEONS_BY_ID[id];

export const D6_DUNGEONS: Readonly<Record<1 | 2 | 3, string>> = {
  1: 'hd_aube',
  2: 'hd_marches',
  3: 'hd_silence',
};
