import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';
import { labelForWorkoutType } from '@/utils/format';

import { InventoryCard } from './components/InventoryCard';
import { MissionHeader } from './components/MissionHeader';
import { QuestsCard } from './components/QuestsCard';
import { SessionCard } from './components/SessionCard';
import { StatsStubCard } from './components/StatsStubCard';
import { useTodayPanel } from './hooks/useTodayPanel';

export const MissionPanelScreen = () => {
  const user = useAppStore((s) => s.user);
  const today = useTodayPanel();

  useFocusEffect(
    useCallback(() => {
      today.refresh();
    }, [today]),
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const workoutTypeLabel = today.workout
    ? labelForWorkoutType(today.workout.type)
    : 'Repos';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <MissionHeader
        rank={user.rank}
        streakDays={user.streakDays}
        weekNumber={today.weekNumber}
        dayOfWeek={today.dayOfWeek}
        workoutTypeLabel={workoutTypeLabel}
        hunterName={user.name}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={today.loading}
            onRefresh={today.refresh}
            tintColor={colors.primary}
          />
        }
      >
        <QuestsCard plan={today.questPlan} record={today.questRecord} />
        <SessionCard workout={today.workout} />
        <StatsStubCard />
        <InventoryCard titles={today.titles} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
