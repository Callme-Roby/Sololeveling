export const newId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const toBool = (n: number | null | undefined): boolean => Boolean(n);

export const fromBool = (b: boolean): number => (b ? 1 : 0);

export const toIsoDate = (d: Date | string | number): string => {
  if (typeof d === 'string') return d;
  return new Date(d).toISOString();
};

export const todayLocalIso = (now: Date = new Date()): string => {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
