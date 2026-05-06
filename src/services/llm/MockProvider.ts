import type {
  ChatMessage,
  GenerateOptions,
  GenerateResult,
  LLMProvider,
  StreamChunkHandler,
} from './types';

const CANNED_REPLIES = [
  "Je suis le provider mock. Branche un vrai LLM dans src/services/llm pour des reponses reelles.",
  "Mock en ligne. Implemente RemoteProvider ou OnDeviceProvider quand ton modele fine-tune est pret.",
  "Stub LLM actif. La couche d'abstraction est prete pour ton modele.",
];

const pickReply = (seed: number): string => {
  return CANNED_REPLIES[seed % CANNED_REPLIES.length];
};

export class MockProvider implements LLMProvider {
  readonly id = 'mock';
  readonly displayName = 'Mock (developpement)';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generate(
    messages: ChatMessage[],
    _options?: GenerateOptions,
  ): Promise<GenerateResult> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const seed = lastUser?.content.length ?? 0;
    const reply = `${pickReply(seed)} (echo: "${lastUser?.content ?? ''}")`;

    await new Promise((r) => setTimeout(r, 350));

    return {
      text: reply,
      finishReason: 'stop',
      usage: {
        inputTokens: lastUser?.content.length ?? 0,
        outputTokens: reply.length,
      },
    };
  }

  async generateStream(
    messages: ChatMessage[],
    onChunk: StreamChunkHandler,
    options?: GenerateOptions,
  ): Promise<GenerateResult> {
    const full = await this.generate(messages, options);
    const words = full.text.split(' ');
    let emitted = '';
    for (const word of words) {
      if (options?.signal?.aborted) {
        return { text: emitted, finishReason: 'stop' };
      }
      const piece = (emitted ? ' ' : '') + word;
      emitted += piece;
      onChunk(piece);
      await new Promise((r) => setTimeout(r, 40));
    }
    return { ...full, text: emitted };
  }
}
