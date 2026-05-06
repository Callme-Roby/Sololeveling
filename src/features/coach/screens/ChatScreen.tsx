import { useEffect, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getLLM } from '@/services/llm';
import { colors } from '@/theme/colors';

import { ChatInput } from '../components/ChatInput';
import { MessageBubble } from '../components/MessageBubble';
import { useChat } from '../hooks/useChat';

const SYSTEM_PROMPT =
  "Tu es l'assistant de l'app Sololeveling. Reponds avec concision et en francais.";

export const ChatScreen = () => {
  const { messages, isGenerating, send, stop, reset } = useChat({
    systemPrompt: SYSTEM_PROMPT,
  });
  const listRef = useRef<FlatList>(null);
  const visibleMessages = messages.filter((m) => m.role !== 'system');

  useEffect(() => {
    if (visibleMessages.length === 0) return;
    const id = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(id);
  }, [visibleMessages.length, isGenerating]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sololeveling</Text>
          <Text style={styles.subtitle}>Provider: {getLLM().displayName}</Text>
        </View>
        <Pressable onPress={reset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reinitialiser</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {visibleMessages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Pret a discuter</Text>
            <Text style={styles.emptySub}>
              Le provider mock repond pour le moment. Branche ton LLM
              fine-tune dans src/services/llm.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={visibleMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}
        <ChatInput
          onSend={send}
          onStop={stop}
          isGenerating={isGenerating}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: { color: colors.textSecondary, fontSize: 12 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 8 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySub: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
