import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { DonjonZeroStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<DonjonZeroStackParamList, 'Intro'>;

const Bullet = ({ children }: { children: string }) => (
  <View style={styles.bullet}>
    <Text style={styles.bulletDot}>{'•'}</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

export const IntroScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.body}>
      <View>
        <Text style={styles.eyebrow}>Donjon Zero</Text>
        <Text style={styles.title}>Mesure ton point de depart</Text>
        <Text style={styles.subtitle}>
          11 baselines, 4 blocs, ~75 min. Tu peux scinder sur 2 jours :
          chaque bloc se sauve a la fin.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conditions</Text>
        <Bullet>Bien repose, pas d'effort intense la veille</Bullet>
        <Bullet>Telephone GPS pret pour le 1km et le sprint</Bullet>
        <Bullet>Echauffement de 15 min avant de demarrer (corde, mobilite)</Bullet>
        <Bullet>Pause de 5 min entre les tests</Bullet>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Les blocs</Text>
        <Bullet>VIT - 1km chrono, 5 min burpees</Bullet>
        <Bullet>AGI - broad jump, sprint 30m, box jump max</Bullet>
        <Bullet>STR - calf raises, ATG hold, equilibre yeux fermes (par jambe)</Bullet>
        <Bullet>GRP - dead hang, tennis ball (par main), farmer carry distance</Bullet>
      </View>
      <Text style={styles.note}>
        "Le Systeme ne juge pas ton point de depart. Il juge le chemin
        parcouru depuis."
      </Text>
    </ScrollView>
    <View style={styles.footer}>
      <PrimaryButton
        label="Commencer le Bloc VIT"
        onPress={() => navigation.navigate('BlocVIT')}
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 24, gap: 18 },
  eyebrow: { color: colors.primary, fontSize: 12, letterSpacing: 2, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginTop: 4 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  cardTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  bullet: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bulletDot: { color: colors.primary, fontSize: 14, lineHeight: 20 },
  bulletText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, flex: 1 },
  note: {
    color: colors.textPrimary,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 14,
  },
  footer: { padding: 24, paddingTop: 8 },
});
