import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = ({ label, error, hint, style, ...rest }: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholderTextColor={colors.textMuted}
      {...rest}
      style={[styles.input, error ? styles.inputError : null, style]}
    />
    {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrap: { gap: 6, marginBottom: 12 },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: { borderColor: colors.danger },
  hint: { color: colors.textMuted, fontSize: 12 },
  error: { color: colors.danger, fontSize: 12 },
});
