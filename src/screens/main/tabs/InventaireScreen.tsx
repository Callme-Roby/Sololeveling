import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Title } from '@/domain/types';
import { titleRepo } from '@/services/db';
import { colors } from '@/theme/colors';

const SOURCE_LABELS: Record<Title['source'], string> = {
  weekly_dungeon: 'Donjon hebdo',
  porte_dungeon: 'Donjon de Porte',
  hidden_dungeon: 'Donjon cache',
  rank_up: 'Rang up',
  milestone: 'Milestone',
};

export const InventaireScreen = () => {
  const [titles, setTitles] = useState<readonly Title[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await titleRepo.list();
      setTitles(list);
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
        <Text style={styles.title}>Inventaire</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{`Titres (${titles.length})`}</Text>
          {titles.length === 0 ? (
            <Text style={styles.empty}>
              Aucun titre debloque. Le premier vient avec le Donjon Zero.
            </Text>
          ) : (
            titles.map((t) => (
              <View key={t.id} style={styles.titleRow}>
                <View style={styles.titleDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.titleName}>{t.name}</Text>
                  <Text style={styles.titleMeta}>
                    {`${SOURCE_LABELS[t.source]} · ${t.unlockedAt.slice(0, 10)}`}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cles</Text>
          <Text style={styles.empty}>
            Aucune cle en reserve. Les donjons caches s'eveillent en Phase 2
            (notifications + d6 dominical + meteo + geoloc).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hall des Titres</Text>
          <Text style={styles.empty}>
            Initie -&gt; Marcheur -&gt; Constant -&gt; Hunter -&gt; Forgeron du Souffle
            -&gt; Genoux Inebranlables -&gt; Coureur d&apos;Ombres -&gt; Forge -&gt; Tranchant
            -&gt; Marteau Vivant -&gt; Sanctifie -&gt; Souverain
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 16 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginVertical: 8 },
  section: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: { color: colors.textMuted, fontSize: 13, lineHeight: 19, fontStyle: 'italic' },
  titleRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 4 },
  titleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 7 },
  titleName: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  titleMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
