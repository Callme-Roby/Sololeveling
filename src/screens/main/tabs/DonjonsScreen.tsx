import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HIDDEN_DUNGEONS } from '@/data/hiddenDungeons';
import { WEEKLY_DUNGEONS } from '@/data/weeklyDungeons';
import type { DungeonAttempt } from '@/domain/types';
import type { RootStackParamList } from '@/navigation/types';
import { dungeonAttemptRepo } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

type Tab = 'weekly' | 'hidden';

export const DonjonsScreen = () => {
  const currentWeek = useAppStore((s) => s.currentWeek);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<Tab>('weekly');
  const [latestByDungeon, setLatestByDungeon] = useState<Record<string, DungeonAttempt | null>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await dungeonAttemptRepo.listAll();
      const map: Record<string, DungeonAttempt> = {};
      for (const a of all) {
        const existing = map[a.dungeonId];
        if (!existing || a.date > existing.date) {
          map[a.dungeonId] = a;
        }
      }
      setLatestByDungeon(map);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Donjons</Text>
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === 'weekly' && styles.tabActive]}
            onPress={() => setTab('weekly')}
          >
            <Text style={[styles.tabLabel, tab === 'weekly' && styles.tabLabelActive]}>
              Hebdo
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'hidden' && styles.tabActive]}
            onPress={() => setTab('hidden')}
          >
            <Text style={[styles.tabLabel, tab === 'hidden' && styles.tabLabelActive]}>
              Caches
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
      >
        {tab === 'weekly' &&
          WEEKLY_DUNGEONS.map((d) => {
            const latest = latestByDungeon[d.id];
            const isCurrent = d.weekNumber === currentWeek;
            const isPast = d.weekNumber < currentWeek;
            return (
              <Pressable
                key={d.id}
                style={[
                  styles.card,
                  d.kind === 'porte' && styles.porteCard,
                  isCurrent && styles.currentCard,
                ]}
                onPress={() =>
                  isCurrent || isPast
                    ? navigation.navigate('DungeonRun', { weekNumber: d.weekNumber })
                    : null
                }
                disabled={!isCurrent && !isPast}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{d.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardEyebrow}>
                      {`Semaine ${d.weekNumber}${d.kind === 'porte' ? ' · Porte' : ''}`}
                    </Text>
                    <Text style={styles.cardTitle}>{d.name}</Text>
                  </View>
                  {latest && (
                    <View style={styles.starsRow}>
                      {[1, 2, 3].map((n) => (
                        <Text
                          key={n}
                          style={[styles.star, latest.starsAchieved >= n && styles.starFilled]}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                {latest && (
                  <Text style={styles.cardMeta}>
                    {`Dernier essai : ${latest.date} · ${latest.completed ? 'complete' : 'abandonne'}`}
                  </Text>
                )}
                {!latest && (
                  <Text style={styles.cardMetaMuted}>
                    {isCurrent
                      ? 'Disponible cette semaine'
                      : isPast
                        ? 'Encore tentable'
                        : 'Verrouille jusqu\'a la semaine'}
                  </Text>
                )}
              </Pressable>
            );
          })}

        {tab === 'hidden' &&
          HIDDEN_DUNGEONS.map((d) => (
            <View
              key={d.id}
              style={[styles.card, d.weatherBonus && styles.weatherCard]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{d.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardEyebrow}>
                    {d.weatherBonus ? 'Bonus meteo' : 'Cache'}
                  </Text>
                  <Text style={styles.cardTitle}>{d.name}</Text>
                </View>
                <Text style={styles.dormantTag}>Dormant</Text>
              </View>
              <Text style={styles.cardMeta}>{d.description}</Text>
              <Text style={styles.cardReward}>
                {`Recompense : ${d.rewardTitle}`}
              </Text>
            </View>
          ))}

        {tab === 'hidden' && (
          <Text style={styles.footnote}>
            Les donjons caches s'eveillent via un d6 dominical, l'API meteo,
            la geoloc ou une invocation libre (Phase 2/3).
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    padding: 4,
    borderRadius: 10,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: colors.primary },
  tabLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  tabLabelActive: { color: colors.textPrimary },
  body: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  porteCard: { borderColor: colors.primary },
  currentCard: { borderColor: colors.success },
  weatherCard: { borderStyle: 'dashed' },
  cardHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cardEmoji: { fontSize: 28 },
  cardEyebrow: {
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 2 },
  cardMeta: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  cardMetaMuted: { color: colors.textMuted, fontSize: 12, fontStyle: 'italic' },
  cardReward: { color: colors.textSecondary, fontSize: 11, fontStyle: 'italic' },
  starsRow: { flexDirection: 'row', gap: 2 },
  star: { color: colors.surface, fontSize: 16 },
  starFilled: { color: colors.primary },
  dormantTag: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    paddingHorizontal: 4,
    marginTop: 4,
  },
});
