import type { GpsPoint } from '@/domain/types';

const EARTH_RADIUS_M = 6371000;
const DEG_TO_RAD = Math.PI / 180;

export const haversineMeters = (a: GpsPoint, b: GpsPoint): number => {
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLng = (b.lng - a.lng) * DEG_TO_RAD;
  const lat1 = a.lat * DEG_TO_RAD;
  const lat2 = b.lat * DEG_TO_RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
};

export interface GpsAggregate {
  distanceMeters: number;
  durationSeconds: number;
  averagePaceSecPerKm: number;
  maxSpeedMps: number;
  elevationGainMeters: number;
}

export const aggregate = (points: readonly GpsPoint[]): GpsAggregate => {
  let distance = 0;
  let elevation = 0;
  let maxSpeed = 0;
  let prev: GpsPoint | null = null;
  for (const pt of points) {
    if (prev) {
      const seg = haversineMeters(prev, pt);
      distance += seg;
      const dt = (pt.ts - prev.ts) / 1000;
      if (dt > 0) {
        const speed = seg / dt;
        if (speed > maxSpeed) maxSpeed = speed;
      }
      if (pt.alt !== undefined && prev.alt !== undefined) {
        const diff = pt.alt - prev.alt;
        if (diff > 0) elevation += diff;
      }
    }
    prev = pt;
  }
  const first = points[0];
  const last = points[points.length - 1];
  const durationSeconds =
    first && last ? Math.max(0, Math.round((last.ts - first.ts) / 1000)) : 0;
  const averagePaceSecPerKm =
    distance > 0 ? (durationSeconds / distance) * 1000 : 0;
  return {
    distanceMeters: Math.round(distance),
    durationSeconds,
    averagePaceSecPerKm: Math.round(averagePaceSecPerKm),
    maxSpeedMps: Math.round(maxSpeed * 100) / 100,
    elevationGainMeters: Math.round(elevation),
  };
};

export const formatPace = (secPerKm: number): string => {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return '--:--';
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(2)} km`;
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};
