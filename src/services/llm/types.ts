export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  signal?: AbortSignal;
}

export interface GenerateResult {
  text: string;
  finishReason?: 'stop' | 'length' | 'error';
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export type StreamChunkHandler = (chunk: string) => void;

export interface LLMProvider {
  readonly id: string;
  readonly displayName: string;

  isAvailable(): Promise<boolean>;

  generate(
    messages: ChatMessage[],
    options?: GenerateOptions,
  ): Promise<GenerateResult>;

  generateStream?(
    messages: ChatMessage[],
    onChunk: StreamChunkHandler,
    options?: GenerateOptions,
  ): Promise<GenerateResult>;
}

export interface LLMConfig {
  providerId: string;
  endpoint?: string;
  apiKey?: string;
  modelName?: string;
  systemPrompt?: string;
}
