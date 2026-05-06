import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'ghost' && styles.labelGhost,
            isDisabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.4 },
  label: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  labelGhost: { color: colors.textSecondary, fontWeight: '500' },
  labelDisabled: {},
});
