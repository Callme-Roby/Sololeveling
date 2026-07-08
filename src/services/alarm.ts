import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';
import { Platform } from 'react-native';

import { APP_STATE_KEYS, appStateRepo } from '@/services/db';
import {
  cancelMorningAlarm as cancelIosAlarm,
  scheduleMorningAlarm as scheduleIosAlarm,
  sendTestNotification as sendIosTest,
} from '@/services/notifications';

export const ALARM_CHANNEL_ID = 'alarm-fullscreen';
const ALARM_ID = 'morning-alarm';
const SNOOZE_ID = 'morning-alarm-snooze';
const TEST_ID = 'morning-alarm-test';

export interface AlarmConfig {
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULT_CONFIG: AlarmConfig = { enabled: false, hour: 7, minute: 0 };

export interface ScheduleResult {
  ok: boolean;
  reason?: 'permission_denied';
  config: AlarmConfig;
}

export const getAlarmConfig = async (): Promise<AlarmConfig> => {
  const stored = await appStateRepo.getJson<AlarmConfig>(
    APP_STATE_KEYS.ALARM_CONFIG,
  );
  if (!stored) return DEFAULT_CONFIG;
  return {
    enabled: Boolean(stored.enabled),
    hour: typeof stored.hour === 'number' ? stored.hour : 7,
    minute: typeof stored.minute === 'number' ? stored.minute : 0,
  };
};

const saveConfig = (c: AlarmConfig): Promise<void> =>
  appStateRepo.setJson(APP_STATE_KEYS.ALARM_CONFIG, c);

export const ensureAlarmChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: ALARM_CHANNEL_ID,
    name: 'Reveil plein ecran',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
    vibrationPattern: [300, 600, 300, 600],
    bypassDnd: true,
  });
};

const nextOccurrence = (hour: number, minute: number): number => {
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
};

export const requestAlarmPermission = async (): Promise<boolean> => {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
};

const alarmAndroidPayload = (title: string, body: string, ongoing: boolean) => ({
  channelId: ALARM_CHANNEL_ID,
  category: AndroidCategory.ALARM,
  importance: AndroidImportance.HIGH,
  visibility: AndroidVisibility.PUBLIC,
  loopSound: true,
  ongoing,
  autoCancel: false,
  fullScreenAction: { id: 'default', launchActivity: 'default' },
  pressAction: { id: 'default', launchActivity: 'default' },
});

export const scheduleAlarm = async (
  hour: number,
  minute: number,
): Promise<ScheduleResult> => {
  const config: AlarmConfig = { enabled: true, hour, minute };

  if (Platform.OS !== 'android') {
    const r = await scheduleIosAlarm(hour, minute);
    const next = { enabled: r.ok, hour, minute };
    await saveConfig(next);
    return { ok: r.ok, reason: r.reason, config: next };
  }

  await ensureAlarmChannel();
  const granted = await requestAlarmPermission();
  if (!granted) {
    const off = { ...config, enabled: false };
    await saveConfig(off);
    return { ok: false, reason: 'permission_denied', config: off };
  }

  await notifee.cancelTriggerNotification(ALARM_ID).catch(() => {});

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: nextOccurrence(hour, minute),
    repeatFrequency: RepeatFrequency.DAILY,
    alarmManager: { allowWhileIdle: true },
  };

  await notifee.createTriggerNotification(
    {
      id: ALARM_ID,
      title: 'C\'est l\'heure de bouger',
      body: 'Ta seance du matin t\'attend.',
      android: alarmAndroidPayload(
        'C\'est l\'heure de bouger',
        'Ta seance du matin t\'attend.',
        true,
      ),
    },
    trigger,
  );

  await saveConfig(config);
  return { ok: true, config };
};

export const cancelAlarm = async (): Promise<AlarmConfig> => {
  const cfg = await getAlarmConfig();
  const next = { ...cfg, enabled: false };
  if (Platform.OS === 'android') {
    await notifee.cancelTriggerNotification(ALARM_ID).catch(() => {});
    await notifee.cancelNotification(ALARM_ID).catch(() => {});
  } else {
    await cancelIosAlarm();
  }
  await saveConfig(next);
  return next;
};

/** Stoppe la sonnerie en cours (annule la notification qui joue en boucle). */
export const stopRinging = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  await notifee.cancelNotification(ALARM_ID).catch(() => {});
  await notifee.cancelNotification(SNOOZE_ID).catch(() => {});
  await notifee.cancelNotification(TEST_ID).catch(() => {});
};

export const scheduleSnooze = async (minutes = 5): Promise<void> => {
  if (Platform.OS !== 'android') return;
  await ensureAlarmChannel();
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + Math.max(1, minutes) * 60 * 1000,
    alarmManager: { allowWhileIdle: true },
  };
  await notifee.createTriggerNotification(
    {
      id: SNOOZE_ID,
      title: 'Petit rappel',
      body: 'Ta seance du matin t\'attend toujours.',
      android: alarmAndroidPayload('Petit rappel', 'Encore une fois.', true),
    },
    trigger,
  );
};

export const sendAlarmTest = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return sendIosTest();
  await ensureAlarmChannel();
  const granted = await requestAlarmPermission();
  if (!granted) return false;
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 3000,
    alarmManager: { allowWhileIdle: true },
  };
  await notifee.createTriggerNotification(
    {
      id: TEST_ID,
      title: 'Test du reveil',
      body: 'Si l\'ecran s\'allume en plein ecran, tout est pret.',
      android: {
        ...alarmAndroidPayload('Test du reveil', 'Test', false),
        ongoing: false,
        autoCancel: true,
      },
    },
    trigger,
  );
  return true;
};

export const openExactAlarmSettings = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  try {
    await notifee.openAlarmPermissionSettings();
  } catch {
    // setting not available on this device/version
  }
};

export const openFullScreenNotificationSettings = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  try {
    await notifee.openNotificationSettings();
  } catch {
    // ignore
  }
};

export const formatAlarmTime = (hour: number, minute: number): string =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
