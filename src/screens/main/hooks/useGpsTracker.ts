import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

import type { GpsPoint } from '@/domain/types';
import { aggregate, type GpsAggregate } from '@/services/gps';

export type GpsState = 'idle' | 'requesting' | 'tracking' | 'stopped' | 'error';

const EMPTY: GpsAggregate = {
  distanceMeters: 0,
  durationSeconds: 0,
  averagePaceSecPerKm: 0,
  maxSpeedMps: 0,
  elevationGainMeters: 0,
};

export interface UseGpsTrackerResult {
  state: GpsState;
  error: string | null;
  points: readonly GpsPoint[];
  stats: GpsAggregate;
  elapsedSeconds: number;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export const useGpsTracker = (): UseGpsTrackerResult => {
  const [state, setState] = useState<GpsState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<readonly GpsPoint[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTsRef = useRef<number | null>(null);

  const cleanup = () => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => cleanup(), []);

  const start = async () => {
    setError(null);
    setState('requesting');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission GPS refusee');
        setState('error');
        return;
      }
      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        setError('Le GPS du systeme est desactive');
        setState('error');
        return;
      }
      setPoints([]);
      setElapsedSeconds(0);
      startTsRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTsRef.current) {
          setElapsedSeconds(
            Math.max(0, Math.round((Date.now() - startTsRef.current) / 1000)),
          );
        }
      }, 1000);
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5,
          timeInterval: 1500,
        },
        (loc) => {
          const pt: GpsPoint = {
            ts: loc.timestamp,
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            alt: loc.coords.altitude ?? undefined,
            accuracy: loc.coords.accuracy ?? undefined,
            speed: loc.coords.speed ?? undefined,
          };
          setPoints((prev) => [...prev, pt]);
        },
      );
      subscriptionRef.current = sub;
      setState('tracking');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur GPS inconnue');
      setState('error');
    }
  };

  const stop = () => {
    cleanup();
    setState('stopped');
  };

  const reset = () => {
    cleanup();
    setPoints([]);
    setElapsedSeconds(0);
    startTsRef.current = null;
    setError(null);
    setState('idle');
  };

  const stats = points.length > 0 ? aggregate(points) : EMPTY;

  return {
    state,
    error,
    points,
    stats: { ...stats, durationSeconds: elapsedSeconds || stats.durationSeconds },
    elapsedSeconds,
    start,
    stop,
    reset,
  };
};
