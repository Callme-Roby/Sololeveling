import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { missionForDate } from '@/data/rehab/morningMissions';
import {
  cancelMorningAlarm,
  getAlarmConfig,
  scheduleMorningAlarm,
  sendTestNotification,
  type AlarmConfig,
} from '@/services/notifications';
import { colors } from '@/theme/colors';

const clampHour = (h: number) => (h + 24) % 24;
const clampMinute = (m: number) => (m + 60) % 60;

export const AlarmCard = () => {
  const [config, setConfig] = useState<AlarmConfig | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAlarmConfig().then((c) => {
      if (!cancelled) setConfig(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!config) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Alarme du matin</Text>
        <Text style={styles.hint}>Chargement...</Text>
      </View>
    );
  }

  const mission = missionForDate();

  const applyTime = async (hour: number, minute: number) => {
    setConfig({ ...config, hour, minute });
    if (config.enabled) {
      setBusy(true);
      const res = await scheduleMorningAlarm(hour, minute);
      setConfig(res.config);
      setBusy(false);
    }
  };

  const toggle = async (value: boolean) => {
    setBusy(true);
    try {
      if (value) {
        const res = await scheduleMorningAlarm(config.hour, config.minute);
        if (!res.ok && res.reason === 'permission_denied') {
          Alert.alert(
            'Notifications refusees',
            'Autorise les notifications dans les reglages du telephone pour activer la sonnerie.',
          );
        }
        setConfig(res.config);
      } else {
        const c = await cancelMorningAlarm();
        setConfig(c);
      }
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    try {
      const ok = await sendTestNotification();
      if (!ok) {
        Alert.alert(
          'Notifications refusees',
          'Autorise les notifications pour tester la sonnerie.',
        );
      } else {
        Alert.alert('Test envoye', 'La sonnerie arrive dans 3 secondes.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Alarme du matin</Text>
        <Switch
          value={config.enabled}
          onValueChange={toggle}
          disabled={busy}
          trackColor={{ false: colors.border, true: colors.primaryMuted }}
          thumbColor={config.enabled ? colors.primary : colors.textMuted}
        />
      </View>

      <View style={styles.timeRow}>
        <TimeStepper
          value={config.hour}
          onChange={(h) => applyTime(clampHour(h), config.minute)}
          label="h"
        />
        <Text style={styles.colon}>:</Text>
        <TimeStepper
          value={config.minute}
          step={5}
          onChange={(m) => applyTime(config.hour, clampMinute(m))}
          label="min"
        />
      </View>

      <View style={styles.missionPreview}>
        <Text style={styles.missionLabel}>Mission du jour a l'ouverture</Text>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        <Text style={styles.missionDetail}>{mission.detail}</Text>
      </View>

      <PrimaryButton
        label="Tester la sonnerie"
        variant="secondary"
        onPress={test}
        loading={busy}
        style={styles.testBtn}
      />
      <Text style={styles.hint}>
        Sonnerie quotidienne locale. Elle respecte le mode silencieux du
        telephone. Une vraie alarme plein ecran (Android) peut etre ajoutee
        en phase 2.
      </Text>
    </View>
  );
};

const TimeStepper = ({
  value,
  onChange,
  step = 1,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  label: string;
}) => (
  <View style={styles.stepper}>
    <Pressable style={styles.stepBtn} onPress={() => onChange(value - step)}>
      <Text style={styles.stepText}>-</Text>
    </Pressable>
    <View style={styles.stepValueBox}>
      <Text style={styles.stepValue}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
    <Pressable style={styles.stepBtn} onPress={() => onChange(value + step)}>
      <Text style={styles.stepText}>+</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  colon: { color: colors.textPrimary, fontSize: 28, fontWeight: '800' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { color: colors.primary, fontSize: 22, fontWeight: '800' },
  stepValueBox: { alignItems: 'center', minWidth: 52 },
  stepValue: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  stepLabel: { color: colors.textMuted, fontSize: 10 },
  missionPreview: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 3,
  },
  missionLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  missionTitle: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  missionDetail: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  testBtn: { minHeight: 44 },
  hint: { color: colors.textMuted, fontSize: 11, lineHeight: 16, fontStyle: 'italic' },
});
