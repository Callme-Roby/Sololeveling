import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { CalMission } from '@/data/calisthenics/progression';
import type { RootStackParamList } from '@/navigation/types';
import { scheduleSnooze, stopRinging } from '@/services/alarm';
import { getCalMission } from '@/services/calisthenics';
import { colors } from '@/theme/colors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ALARM_SOUND = require('../../../assets/alarm.wav');

type Props = NativeStackScreenProps<RootStackParamList, 'WakeUp'>;

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const WakeUpScreen = ({ navigation }: Props) => {
  const [mission, setMission] = useState<CalMission | null>(null);
  const [time] = useState(now());
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCalMission().then(({ mission: m }) => {
      if (!cancelled) setMission(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Joue le son d'alarme en boucle tant que l'ecran de reveil est affiche.
  // Sur le flux media : audible meme si le telephone est en silencieux.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // L'ecran est affiche : on coupe la sonnerie systeme (Notifee) et
        // c'est expo-av qui prend le relais (audible meme en silencieux).
        await stopRinging().catch(() => {});
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        });
        const { sound } = await Audio.Sound.createAsync(ALARM_SOUND, {
          isLooping: true,
          volume: 1.0,
          shouldPlay: true,
        });
        if (!active) {
          await sound.unloadAsync().catch(() => {});
          return;
        }
        soundRef.current = sound;
      } catch {
        // pas de son dispo : l'ecran reste utilisable
      }
    })();
    return () => {
      active = false;
      const s = soundRef.current;
      soundRef.current = null;
      if (s) {
        s.stopAsync().catch(() => {});
        s.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const stopSound = async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) {
      await s.stopAsync().catch(() => {});
      await s.unloadAsync().catch(() => {});
    }
  };

  const start = async () => {
    await stopSound();
    await stopRinging().catch(() => {});
    navigation.replace('CalisthenicsSession');
  };

  const snooze = async () => {
    await stopSound();
    await stopRinging().catch(() => {});
    await scheduleSnooze(5).catch(() => {});
    navigation.goBack();
  };

  const dismiss = async () => {
    await stopSound();
    await stopRinging().catch(() => {});
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        {/* Zone illustration - a remplacer par tes visuels */}
        <View style={styles.artZone}>
          <Text style={styles.artEmoji}>{'\u{1F304}'}</Text>
        </View>

        <Text style={styles.time}>{time}</Text>
        <Text style={styles.wake}>C'est l'heure de bouger</Text>

        <View style={styles.missionCard}>
          <Text style={styles.missionEyebrow}>Mission du matin</Text>
          <Text style={styles.missionTitle}>{mission?.dayLabel ?? 'Jour 1'}</Text>
          <Text style={styles.missionFocus}>{mission?.focus ?? 'Street Workout'}</Text>
          {mission && (
            <View style={styles.list}>
              {mission.items
                .filter((i) => i.pattern !== 'warmup')
                .slice(0, 3)
                .map((i) => (
                  <Text key={i.pattern} style={styles.listItem}>
                    {`${i.emoji}  ${i.name} — ${i.sets}x${i.target}`}
                  </Text>
                ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.startBtn} onPress={start}>
          <Text style={styles.startText}>Commencer la seance</Text>
        </Pressable>
        <View style={styles.secondaryRow}>
          <Pressable style={styles.snoozeBtn} onPress={snooze}>
            <Text style={styles.snoozeText}>Plus tard (5 min)</Text>
          </Pressable>
          <Pressable style={styles.dismissBtn} onPress={dismiss}>
            <Text style={styles.dismissText}>Ignorer</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 8 },
  artZone: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  artEmoji: { fontSize: 72 },
  time: { color: colors.textPrimary, fontSize: 52, fontWeight: '800', fontVariant: ['tabular-nums'] },
  wake: { color: colors.primary, fontSize: 16, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  missionCard: {
    marginTop: 20,
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 4,
  },
  missionEyebrow: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  missionTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  missionFocus: { color: colors.textSecondary, fontSize: 14, marginBottom: 6 },
  list: { gap: 4 },
  listItem: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  actions: { padding: 24, gap: 12 },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startText: { color: colors.textPrimary, fontSize: 17, fontWeight: '800' },
  secondaryRow: { flexDirection: 'row', gap: 12 },
  snoozeBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  snoozeText: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
  dismissBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dismissText: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
});
