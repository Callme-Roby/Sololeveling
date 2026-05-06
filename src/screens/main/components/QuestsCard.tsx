import { StyleSheet, Text, View } from 'react-native';

import type { DailyQuestPlan, DailyQuestRecord } from '@/domain/types';
import { colors } from '@/theme/colors';

interface Props {
  plan: DailyQuestPlan;
  record: DailyQuestRecord | null;
}

const QuestRow = ({
  label,
  detail,
  done,
  loadKg,
}: {
  label: string;
  detail: string;
  done: boolean;
  loadKg?: number;
}) => (
  <View style={styles.row}>
    <View style={[styles.checkbox, done && styles.checkboxDone]}>
      {done && <Text style={styles.checkboxMark}>{'✓'}</Text>}
    </View>
    <View style={styles.rowContent}>
      <Text style={[styles.label, done && styles.labelDone]}>{label}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
    {loadKg !== undefined && loadKg > 0 && (
      <View style={styles.loadBadge}>
        <Text style={styles.loadText}>{`+${loadKg} kg`}</Text>
      </View>
    )}
  </View>
);

export const QuestsCard = ({ plan, record }: Props) => {
  const completed = [
    record?.hangCompleted,
    record?.calvesCompleted,
    record?.atgCompleted,
    record?.crushCompleted,
  ].filter(Boolean).length;

  const calvesLabel = plan.calvesUnilateral
    ? `Mollets unilateral ${plan.calvesSets}x${plan.calvesPerSet}${plan.calvesDeficit ? ' deficit' : ''} + Tib`
    : `Mollets ${plan.calvesSets}x${plan.calvesPerSet} + Tib ${plan.tibialisSets}x${plan.tibialisPerSet}`;

  const crushLabel =
    plan.crushVariant === 'tennis_ball'
      ? `Tennis ball ${plan.crushSets}x${plan.crushSecondsPerHand}s/main`
      : plan.crushVariant === 'hard_ball_or_towel'
        ? 'Balle dure + serviette mouillee'
        : 'Gripper / ecrasement progressif';

  const atgLabel = plan.atgPausedReps
    ? `ATG ${plan.atgHoldSeconds}s + ${plan.atgPausedReps} squats paused`
    : `ATG hold ${plan.atgHoldSeconds}s`;

  const hangLabel = plan.hangLoadKgHint
    ? `Hang ${plan.hangSets}x${Math.round(plan.hangSecondsTarget / plan.hangSets)}s + leste ${plan.hangLoadKgHint}kg`
    : `Hang ${plan.hangSets}x${Math.round(plan.hangSecondsTarget / plan.hangSets)}s`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Quetes journalieres</Text>
        <Text style={styles.counter}>{`${completed} / 4`}</Text>
      </View>
      <QuestRow
        label="Hang barre"
        detail={hangLabel}
        done={record?.hangCompleted ?? false}
        loadKg={record?.hangLoadKg}
      />
      <QuestRow
        label="Mollets / Tibialis"
        detail={calvesLabel}
        done={record?.calvesCompleted ?? false}
        loadKg={record?.calvesLoadKg}
      />
      <QuestRow
        label="ATG"
        detail={atgLabel}
        done={record?.atgCompleted ?? false}
      />
      <QuestRow
        label="Crush du jour"
        detail={crushLabel}
        done={record?.crushCompleted ?? false}
      />
      <Text style={styles.footnote}>
        Validation interactive : lot 5 (popup lestage + sauvegarde).
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  counter: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxMark: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
  rowContent: { flex: 1 },
  label: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  labelDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  detail: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  loadBadge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loadText: { color: colors.textPrimary, fontSize: 11, fontWeight: '700' },
  footnote: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic', marginTop: 6 },
});
