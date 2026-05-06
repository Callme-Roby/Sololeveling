import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { runDailyRollover } from '@/services/dailyRollover';
import { openDatabase, userRepo } from '@/services/db';
import { useAppStore } from '@/store/appStore';
import { colors } from '@/theme/colors';

export const BootScreen = () => {
  const bootStatus = useAppStore((s) => s.bootStatus);
  const bootError = useAppStore((s) => s.bootError);
  const setBootReady = useAppStore((s) => s.setBootReady);
  const setBootError = useAppStore((s) => s.setBootError);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await openDatabase();
        const user = await userRepo.getCurrent();
        if (user) {
          const { user: rolledUser } = await runDailyRollover(user);
          if (!cancelled) setBootReady(rolledUser);
        } else if (!cancelled) {
          setBootReady(null);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        if (!cancelled) setBootError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setBootReady, setBootError]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sololeveling</Text>
      {bootStatus === 'pending' && (
        <>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.subtitle}>Initialisation du Systeme...</Text>
        </>
      )}
      {bootStatus === 'error' && (
        <>
          <Text style={styles.errorTitle}>Echec d'initialisation</Text>
          <Text style={styles.errorBody}>{bootError}</Text>
          <Pressable
            style={styles.retry}
            onPress={() => useAppStore.setState({ bootStatus: 'pending', bootError: null })}
          >
            <Text style={styles.retryText}>Reessayer</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 24,
  },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
  errorTitle: { color: colors.danger, fontSize: 16, fontWeight: '600' },
  errorBody: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  retry: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryText: { color: colors.textPrimary, fontSize: 14 },
});
