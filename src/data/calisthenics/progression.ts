import {
  CALISTHENICS_PATTERNS,
  getPattern,
  type CalLevel,
  type MovementPattern,
} from './catalog';

export interface PatternProgress {
  level: number;
  target: number;
}

export interface CalState {
  dayIndex: number;
  lastSessionDate: string | null;
  patterns: Record<MovementPattern, PatternProgress>;
}

export interface MissionItem {
  pattern: MovementPattern;
  patternLabel: string;
  emoji: string;
  exerciseId: string;
  name: string;
  unit: CalLevel['unit'];
  sets: number;
  target: number;
  instructions: string;
  levelIndex: number;
  isLastLevel: boolean;
}

export interface CalMission {
  dayIndex: number;
  dayLabel: string;
  focus: string;
  items: MissionItem[];
  estimatedMinutes: number;
}

/** Etat initial : niveau 0, cible de depart, pour tous les patterns. */
export const defaultCalState = (): CalState => {
  const patterns = {} as Record<MovementPattern, PatternProgress>;
  for (const p of CALISTHENICS_PATTERNS) {
    patterns[p.id] = { level: 0, target: p.levels[0].startTarget };
  }
  return { dayIndex: 0, lastSessionDate: null, patterns };
};

/** Repare un etat charge depuis le stockage (patterns manquants -> defaut). */
export const normalizeCalState = (raw: Partial<CalState> | null): CalState => {
  const base = defaultCalState();
  if (!raw) return base;
  const patterns = { ...base.patterns };
  for (const p of CALISTHENICS_PATTERNS) {
    const stored = raw.patterns?.[p.id];
    if (stored && typeof stored.level === 'number') {
      const levelIdx = Math.max(0, Math.min(stored.level, p.levels.length - 1));
      const lvl = p.levels[levelIdx];
      patterns[p.id] = {
        level: levelIdx,
        target:
          typeof stored.target === 'number'
            ? Math.max(lvl.startTarget, Math.min(stored.target, lvl.capTarget))
            : lvl.startTarget,
      };
    }
  }
  return {
    dayIndex: raw.dayIndex ?? 0,
    lastSessionDate: raw.lastSessionDate ?? null,
    patterns,
  };
};

const levelFor = (pattern: MovementPattern, progress: PatternProgress): CalLevel => {
  const def = getPattern(pattern);
  const idx = Math.max(0, Math.min(progress.level, def.levels.length - 1));
  return def.levels[idx];
};

const buildItem = (
  pattern: MovementPattern,
  state: CalState,
): MissionItem => {
  const def = getPattern(pattern);
  const progress = state.patterns[pattern];
  const lvl = levelFor(pattern, progress);
  return {
    pattern,
    patternLabel: def.label,
    emoji: def.emoji,
    exerciseId: lvl.exerciseId,
    name: lvl.name,
    unit: lvl.unit,
    sets: lvl.sets,
    target: progress.target,
    instructions: lvl.instructions,
    levelIndex: progress.level,
    isLastLevel: progress.level >= def.levels.length - 1,
  };
};

/**
 * Split debutant qui alterne. Toujours un echauffement + gainage,
 * puis un focus Poussee (jours pairs) ou Tirage (jours impairs), plus
 * un complement pour equilibrer le corps.
 */
const patternsForDay = (dayIndex: number): MovementPattern[] => {
  const pushDay = dayIndex % 2 === 0;
  if (pushDay) {
    return ['warmup', 'push', 'pull_horizontal', 'core', 'legs'];
  }
  return ['warmup', 'pull_vertical', 'dip', 'core', 'legs'];
};

const focusForDay = (dayIndex: number): string =>
  dayIndex % 2 === 0 ? 'Poussee + haut du corps' : 'Tirage + gainage';

export const buildMission = (state: CalState): CalMission => {
  const patterns = patternsForDay(state.dayIndex);
  const items = patterns.map((p) => buildItem(p, state));
  const estimatedMinutes = 8 + items.length * 4;
  return {
    dayIndex: state.dayIndex,
    dayLabel: `Jour ${state.dayIndex + 1}`,
    focus: focusForDay(state.dayIndex),
    items,
    estimatedMinutes,
  };
};

/**
 * Applique la progression apres une seance. Pour chaque pattern reussi
 * (cible atteinte sur la majorite des series), on augmente la cible d'un
 * cran ; si on depasse le plafond du niveau, on passe au niveau suivant
 * et on repart a sa cible de depart.
 */
export const applyCompletion = (
  state: CalState,
  completedPatterns: MovementPattern[],
  sessionDate: string,
): CalState => {
  const patterns = { ...state.patterns };
  for (const pattern of completedPatterns) {
    const def = getPattern(pattern);
    const progress = patterns[pattern];
    const lvl = def.levels[progress.level];
    let nextTarget = progress.target + lvl.step;
    let nextLevel = progress.level;
    if (nextTarget > lvl.capTarget) {
      if (progress.level < def.levels.length - 1) {
        nextLevel = progress.level + 1;
        nextTarget = def.levels[nextLevel].startTarget;
      } else {
        nextTarget = lvl.capTarget;
      }
    }
    patterns[pattern] = { level: nextLevel, target: nextTarget };
  }

  const advancedDay = state.lastSessionDate !== sessionDate;
  return {
    dayIndex: advancedDay ? state.dayIndex + 1 : state.dayIndex,
    lastSessionDate: sessionDate,
    patterns,
  };
};

export interface CalStatTotals {
  PUSH: number;
  PULL: number;
  CORE: number;
  LEGS: number;
}

/** Niveau cumule par stat (somme des index de niveau des patterns). */
export const statTotalsFromState = (state: CalState): CalStatTotals => {
  const totals: CalStatTotals = { PUSH: 0, PULL: 0, CORE: 0, LEGS: 0 };
  for (const def of CALISTHENICS_PATTERNS) {
    const progress = state.patterns[def.id];
    totals[def.stat] += progress.level * 10 + (progress.target - def.levels[progress.level].startTarget);
  }
  return totals;
};
