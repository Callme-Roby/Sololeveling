import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Home'>;

const RADII: readonly (30 | 50 | 100)[] = [30, 50, 100];

export const HomeScreen = ({ navigation, route }: Props) => {
  const { name, bodyWeightKg } = route.params;
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<30 | 50 | 100>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setError(null);
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(
          'Permission GPS refusee. Active la dans les reglages systeme pour continuer.',
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur GPS inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text style={styles.step}>Etape 2 / 3</Text>
          <Text style={styles.title}>Ton domicile</Text>
          <Text style={styles.subtitle}>
            Le Donjon du Voyageur s'active quand tu t'eloignes de ce point. Le
            tracking GPS course/marche reste 100% local.
          </Text>
        </View>

        <PrimaryButton
          label={coords ? 'Reactualiser ma position' : 'Capturer ma position GPS'}
          onPress={fetchLocation}
          loading={loading}
          variant={coords ? 'secondary' : 'primary'}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        {coords && (
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>Position enregistree</Text>
            <Text style={styles.coordValue}>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </Text>
          </View>
        )}

        <View style={styles.radiusBlock}>
          <Text style={styles.radiusLabel}>Rayon "domicile" (km)</Text>
          <Text style={styles.radiusHint}>
            Au-dela, le Voyageur peut apparaitre.
          </Text>
          <View style={styles.radiusRow}>
            {RADII.map((r) => (
              <Pressable
                key={r}
                style={[styles.radiusChip, radius === r && styles.radiusChipActive]}
                onPress={() => setRadius(r)}
              >
                <Text
                  style={[
                    styles.radiusChipText,
                    radius === r && styles.radiusChipTextActive,
                  ]}
                >
                  {r} km
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Continuer"
          disabled={!coords}
          onPress={() =>
            coords &&
            navigation.navigate('Ready', {
              name,
              bodyWeightKg,
              homeLat: coords.lat,
              homeLng: coords.lng,
              homeRadiusKm: radius,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: 24, gap: 16 },
  header: { gap: 6, marginBottom: 8 },
  step: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  error: { color: colors.danger, fontSize: 13 },
  coordBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  coordLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coordValue: { color: colors.textPrimary, fontSize: 16, marginTop: 4, fontVariant: ['tabular-nums'] },
  radiusBlock: { gap: 6, marginTop: 8 },
  radiusLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  radiusHint: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  radiusRow: { flexDirection: 'row', gap: 10 },
  radiusChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  radiusChipActive: { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
  radiusChipText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
  radiusChipTextActive: { color: colors.textPrimary },
  footer: { padding: 24, paddingTop: 8 },
});
