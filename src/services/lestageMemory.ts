import { APP_STATE_KEYS, appStateRepo } from '@/services/db';

type Memory = Record<string, number>;

let cache: Memory | null = null;

const load = async (): Promise<Memory> => {
  if (cache) return cache;
  const stored = await appStateRepo.getJson<Memory>(APP_STATE_KEYS.LESTAGE_MEMORY);
  cache = stored ?? {};
  return cache;
};

export const getLastLoad = async (exerciseId: string): Promise<number> => {
  const mem = await load();
  return mem[exerciseId] ?? 0;
};

export const rememberLoad = async (
  exerciseId: string,
  loadKg: number,
): Promise<void> => {
  const mem = await load();
  mem[exerciseId] = loadKg;
  cache = mem;
  await appStateRepo.setJson(APP_STATE_KEYS.LESTAGE_MEMORY, mem);
};

export const clearLestageMemory = async (): Promise<void> => {
  cache = {};
  await appStateRepo.delete(APP_STATE_KEYS.LESTAGE_MEMORY);
};
