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
        <Text style={styles.eyebrow}>Le Systeme</Text>
        <Text style={styles.title}>Sololeveling</Text>
        <Text style={styles.subtitle}>
          12 semaines. 4 stats. Rang E vers Rang B.
        </Text>
      </View>
      <Text style={styles.lore}>
        "Le rang n'est pas donne. Il se forge, jour apres jour."
      </Text>
      <Text style={styles.body1}>
        Tu vas configurer ton profil, definir ton domicile, puis traverser
        le Donjon Zero pour mesurer ton point de depart. Le programme
        commence apres.
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
