import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { ChatMessage } from '@/services/llm/types';

interface Props {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: Props) => {
  if (message.role === 'system') return null;

  const isUser = message.role === 'user';
  const containerStyle = [
    styles.row,
    isUser ? styles.rowUser : styles.rowAssistant,
  ];
  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.bubbleUser : styles.bubbleAssistant,
  ];

  return (
    <View style={containerStyle}>
      <View style={bubbleStyle}>
        <Text style={styles.role}>{isUser ? 'Toi' : 'Modele'}</Text>
        <Text style={styles.content}>
          {message.content || (isUser ? '' : '...')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginVertical: 6,
    flexDirection: 'row',
  },
  rowUser: { justifyContent: 'flex-end' },
  rowAssistant: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleUser: {
    backgroundColor: colors.userBubble,
    borderTopRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.assistantBubble,
    borderTopLeftRadius: 4,
  },
  role: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 21,
  },
});
