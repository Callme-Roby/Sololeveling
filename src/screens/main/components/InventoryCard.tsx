import { StyleSheet, Text, View } from 'react-native';

import type { Title } from '@/domain/types';
import { colors } from '@/theme/colors';

interface Props {
  titles: readonly Title[];
}

export const InventoryCard = ({ titles }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>Inventaire</Text>
    <View style={styles.section}>
      <Text style={styles.subTitle}>Cles</Text>
      <Text style={styles.empty}>Aucune (donjons caches : lot 9)</Text>
    </View>
    <View style={styles.section}>
      <Text style={styles.subTitle}>{`Titres (${titles.length})`}</Text>
      {titles.length === 0 ? (
        <Text style={styles.empty}>Aucun titre debloque pour l'instant.</Text>
      ) : (
        <View style={styles.titleList}>
          {titles.map((t) => (
            <View key={t.id} style={styles.titleChip}>
              <Text style={styles.titleChipText}>{t.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: { gap: 4 },
  subTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: { color: colors.textMuted, fontSize: 12, fontStyle: 'italic' },
  titleList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  titleChip: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleChipText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
});
