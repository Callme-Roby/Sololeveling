import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.body}>
      <View style={styles.heroBlock}>
        <Text style={styles.eyebrow}>Ton coach</Text>
        <Text style={styles.title}>Programme sur-mesure</Text>
        <Text style={styles.subtitle}>
          Renforcement, cheville, rappels et suivi.
        </Text>
      </View>
      <Text style={styles.lore}>
        "La regularite bat l'intensite. Un peu, chaque jour."
      </Text>
      <Text style={styles.body1}>
        Configure ton profil, active un rappel le matin si tu veux, puis
        lance ta premiere seance. Tout progresse a ton rythme.
      </Text>
    </View>
    <View style={styles.footer}>
      <PrimaryButton label="Commencer" onPress={() => navigation.navigate('Profile')} />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, padding: 32, justifyContent: 'center', gap: 28 },
  heroBlock: { gap: 8 },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: { color: colors.textSecondary, fontSize: 16, lineHeight: 22 },
  lore: {
    color: colors.textPrimary,
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 24,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 14,
  },
  body1: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  footer: { padding: 24, paddingTop: 0 },
});
