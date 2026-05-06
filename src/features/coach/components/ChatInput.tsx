import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  isGenerating: boolean;
}

export const ChatInput = ({ onSend, onStop, isGenerating }: Props) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Pose ta question..."
        placeholderTextColor={colors.textMuted}
        multiline
        editable={!isGenerating}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        blurOnSubmit
      />
      {isGenerating ? (
        <Pressable style={[styles.button, styles.stop]} onPress={onStop}>
          <ActivityIndicator color={colors.textPrimary} />
        </Pressable>
      ) : (
        <Pressable
          style={[styles.button, !value.trim() && styles.disabled]}
          onPress={handleSend}
          disabled={!value.trim()}
        >
          <View style={styles.arrow} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.primaryMuted,
    opacity: 0.6,
  },
  stop: {
    backgroundColor: colors.danger,
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.textPrimary,
    marginLeft: 3,
  },
});
