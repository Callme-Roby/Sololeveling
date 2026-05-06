import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';

interface Props {
  step: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  onSecondary?: () => void;
  secondaryLabel?: string;
}

export const BlocLayout = ({
  step,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel = 'Continuer',
  continueDisabled,
  continueLoading,
  onSecondary,
  secondaryLabel,
}: Props) => (
  <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.step}>{step}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.children}>{children}</View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label={continueLabel}
          onPress={onContinue}
          disabled={continueDisabled}
          loading={continueLoading}
        />
        {onSecondary && secondaryLabel && (
          <PrimaryButton
            variant="ghost"
            label={secondaryLabel}
            onPress={onSecondary}
            style={styles.secondary}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  body: { padding: 24, paddingBottom: 12, gap: 16 },
  header: { gap: 6 },
  step: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  children: { gap: 4 },
  footer: { padding: 24, paddingTop: 8, gap: 4 },
  secondary: { marginTop: 4 },
});
