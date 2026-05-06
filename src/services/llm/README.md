# LLM service layer

This folder is the integration point for the fine-tuned model. The UI only
talks to `getLLM()` and never to a specific provider.

## Switching provider at runtime

```ts
import { configureLLM } from '@/services/llm';

configureLLM({
  providerId: 'remote',
  endpoint: 'https://your-host/v1/chat/completions',
  apiKey: process.env.EXPO_PUBLIC_LLM_API_KEY,
  modelName: 'sololeveling-ft-v1',
});
```

`RemoteProvider` speaks an OpenAI-compatible chat schema. Most fine-tuning
hosts (vLLM, llama.cpp server, TGI, OpenAI fine-tunes, Together, Groq,
Anthropic-compatible gateways) expose this format.

## Adding an on-device provider later

Create `OnDeviceProvider.ts` implementing `LLMProvider`. Suggested backends:

- `llama.rn` for GGUF models in React Native.
- `react-native-mlc-llm` for MLC-compiled models.
- `executorch` once stable.

Then add a case in `index.ts -> configureLLM()`.

## Contract

Every provider implements `LLMProvider` from `./types.ts`:

- `generate(messages, options)` — one-shot completion.
- `generateStream(messages, onChunk, options)` — token streaming (optional).
- `isAvailable()` — health check used by the UI to fall back gracefully.
