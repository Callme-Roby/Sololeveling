import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { APP_STATE_KEYS, appStateRepo } from '@/services/db';

const CHANNEL_ID = 'morning-alarm';

export interface AlarmConfig {
  enabled: boolean;
  hour: number;
  minute: number;
  scheduledId: string | null;
}

const DEFAULT_CONFIG: AlarmConfig = {
  enabled: false,
  hour: 7,
  minute: 0,
  scheduledId: null,
};

let handlerConfigured = false;

/**
 * Sets the foreground handler + Android channel. Safe to call at boot;
 * it never prompts for permission (that happens only when the user
 * enables the alarm).
 */
export const setupNotifications = async (): Promise<void> => {
  if (!handlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    handlerConfigured = true;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Reveil du matin',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 400, 250, 400],
      lightColor: '#7c5cff',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
};

export const getAlarmConfig = async (): Promise<AlarmConfig> => {
  const stored = await appStateRepo.getJson<AlarmConfig>(
    APP_STATE_KEYS.ALARM_CONFIG,
  );
  return stored ?? DEFAULT_CONFIG;
};

const saveAlarmConfig = async (config: AlarmConfig): Promise<void> => {
  await appStateRepo.setJson(APP_STATE_KEYS.ALARM_CONFIG, config);
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return asked.granted;
};

export interface ScheduleResult {
  ok: boolean;
  reason?: 'permission_denied';
  config: AlarmConfig;
}

/**
 * Cancels any previous morning alarm and schedules a new daily one.
 * The body carries the day-of scheduling; the actual mission is revealed
 * in-app when the user opens it.
 */
export const scheduleMorningAlarm = async (
  hour: number,
  minute: number,
  title = 'Le Systeme t\'appelle',
  body = 'Ta mission du jour t\'attend. Ouvre l\'app pour la decouvrir.',
): Promise<ScheduleResult> => {
  await setupNotifications();

  const granted = await requestNotificationPermission();
  if (!granted) {
    const cfg = { ...(await getAlarmConfig()), enabled: false };
    await saveAlarmConfig(cfg);
    return { ok: false, reason: 'permission_denied', config: cfg };
  }

  const existing = await getAlarmConfig();
  if (existing.scheduledId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existing.scheduledId);
    } catch {
      // already gone
    }
  }

  const scheduledId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
  });

  const config: AlarmConfig = { enabled: true, hour, minute, scheduledId };
  await saveAlarmConfig(config);
  return { ok: true, config };
};

export const cancelMorningAlarm = async (): Promise<AlarmConfig> => {
  const existing = await getAlarmConfig();
  if (existing.scheduledId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existing.scheduledId);
    } catch {
      // already gone
    }
  }
  const config: AlarmConfig = { ...existing, enabled: false, scheduledId: null };
  await saveAlarmConfig(config);
  return config;
};

export const sendTestNotification = async (): Promise<boolean> => {
  await setupNotifications();
  const granted = await requestNotificationPermission();
  if (!granted) return false;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test du reveil',
      body: 'Si tu vois et entends ceci, la sonnerie est prete.',
      sound: 'default',
    },
    trigger: {
      seconds: 3,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
  });
  return true;
};

export const scheduleSnooze = async (minutes = 5): Promise<void> => {
  await setupNotifications();
  const granted = await requestNotificationPermission();
  if (!granted) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Le Systeme insiste',
      body: 'Ta mission du matin t\'attend toujours.',
      sound: 'default',
    },
    trigger: {
      seconds: Math.max(60, minutes * 60),
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
  });
};

export const formatAlarmTime = (hour: number, minute: number): string =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
