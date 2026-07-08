import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { missionForDate } from '@/data/rehab/morningMissions';
import { AlarmCard } from '@/screens/main/components/AlarmCard';
import { colors } from '@/theme/colors';

export const RappelsScreen = () => {
  const mission = missionForDate();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Rappels</Text>
        <Text style={styles.subtitle}>
          Programme une sonnerie plein ecran le matin pour lancer ta seance.
        </Text>

        <AlarmCard />

        <View style={styles.missionCard}>
          <Text style={styles.cardLabel}>Suggestion du jour</Text>
          <Text style={styles.missionTitle}>{mission.title}</Text>
          <Text style={styles.missionDetail}>{mission.detail}</Text>
          <Text style={styles.missionMeta}>{`~${mission.estimatedMinutes} min`}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 13 },
  missionCard: { backgroundColor: colors.surfaceAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 4 },
  cardLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  missionTitle: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  missionDetail: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  missionMeta: { color: colors.textMuted, fontSize: 12 },
});
