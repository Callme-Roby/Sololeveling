import type {
  ChatMessage,
  GenerateOptions,
  GenerateResult,
  LLMProvider,
  StreamChunkHandler,
} from './types';

export interface RemoteProviderConfig {
  endpoint: string;
  apiKey?: string;
  modelName?: string;
  headers?: Record<string, string>;
}

interface OpenAILikeChunk {
  choices?: Array<{
    delta?: { content?: string };
    message?: { content?: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

export class RemoteProvider implements LLMProvider {
  readonly id = 'remote';
  readonly displayName = 'Remote API';

  constructor(private config: RemoteProviderConfig) {}

  async isAvailable(): Promise<boolean> {
    if (!this.config.endpoint) return false;
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 3000);
      const res = await fetch(this.config.endpoint, {
        method: 'OPTIONS',
        signal: ctrl.signal,
      });
      clearTimeout(timeout);
      return res.ok || res.status === 405;
    } catch {
      return false;
    }
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };
    if (this.config.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`;
    }
    return headers;
  }

  private buildBody(
    messages: ChatMessage[],
    options?: GenerateOptions,
    stream = false,
  ) {
    return JSON.stringify({
      model: this.config.modelName ?? 'fine-tuned',
      messages: messages.map(({ role, content }) => ({ role, content })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 512,
      top_p: options?.topP ?? 1,
      stop: options?.stopSequences,
      stream,
    });
  }

  async generate(
    messages: ChatMessage[],
    options?: GenerateOptions,
  ): Promise<GenerateResult> {
    const res = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: this.buildBody(messages, options, false),
      signal: options?.signal,
    });

    if (!res.ok) {
      throw new Error(`LLM HTTP ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as OpenAILikeChunk;
    const text = data.choices?.[0]?.message?.content ?? '';
    return {
      text,
      finishReason:
        (data.choices?.[0]?.finish_reason as GenerateResult['finishReason']) ??
        'stop',
      usage: {
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
      },
    };
  }

  async generateStream(
    messages: ChatMessage[],
    onChunk: StreamChunkHandler,
    options?: GenerateOptions,
  ): Promise<GenerateResult> {
    const res = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: this.buildBody(messages, options, true),
      signal: options?.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(`LLM stream HTTP ${res.status}`);
    }

    const reader = (res.body as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder();
    let acc = '';
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload) as OpenAILikeChunk;
          const piece = parsed.choices?.[0]?.delta?.content ?? '';
          if (piece) {
            acc += piece;
            onChunk(piece);
          }
        } catch {
          // ignore malformed SSE frames
        }
      }
    }

    return { text: acc, finishReason: 'stop' };
  }
}
