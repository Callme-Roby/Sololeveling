import { useCallback, useRef, useState } from 'react';

import { getLLM } from '@/services/llm';
import type { ChatMessage } from '@/services/llm/types';

const newId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export interface UseChatOptions {
  systemPrompt?: string;
}

export interface UseChatResult {
  messages: ChatMessage[];
  isGenerating: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export const useChat = (options: UseChatOptions = {}): UseChatResult => {
  const initialMessages: ChatMessage[] = options.systemPrompt
    ? [
        {
          id: newId(),
          role: 'system',
          content: options.systemPrompt,
          createdAt: Date.now(),
        },
      ]
    : [];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating) return;

      const userMessage: ChatMessage = {
        id: newId(),
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      };
      const placeholder: ChatMessage = {
        id: newId(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };

      const baseHistory = [...messages, userMessage];
      setMessages([...baseHistory, placeholder]);
      setIsGenerating(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;
      const llm = getLLM();

      try {
        if (llm.generateStream) {
          await llm.generateStream(
            baseHistory,
            (chunk) => {
              setMessages((curr) => {
                const next = [...curr];
                const last = next[next.length - 1];
                if (last && last.id === placeholder.id) {
                  next[next.length - 1] = {
                    ...last,
                    content: last.content + chunk,
                  };
                }
                return next;
              });
            },
            { signal: controller.signal },
          );
        } else {
          const result = await llm.generate(baseHistory, {
            signal: controller.signal,
          });
          setMessages((curr) => {
            const next = [...curr];
            const last = next[next.length - 1];
            if (last && last.id === placeholder.id) {
              next[next.length - 1] = { ...last, content: result.text };
            }
            return next;
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        setMessages((curr) =>
          curr.map((m) =>
            m.id === placeholder.id
              ? { ...m, content: `[erreur] ${message}` }
              : m,
          ),
        );
      } finally {
        setIsGenerating(false);
        abortRef.current = null;
      }
    },
    [messages, isGenerating],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsGenerating(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages(initialMessages);
    setError(null);
    setIsGenerating(false);
  }, [initialMessages]);

  return { messages, isGenerating, error, send, stop, reset };
};
