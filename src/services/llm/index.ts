import { MockProvider } from './MockProvider';
import { RemoteProvider } from './RemoteProvider';
import type { LLMConfig, LLMProvider } from './types';

export * from './types';
export { MockProvider, RemoteProvider };

let activeProvider: LLMProvider = new MockProvider();

export const getLLM = (): LLMProvider => activeProvider;

export const configureLLM = (config: LLMConfig): LLMProvider => {
  switch (config.providerId) {
    case 'remote':
      if (!config.endpoint) {
        throw new Error('RemoteProvider requires an endpoint.');
      }
      activeProvider = new RemoteProvider({
        endpoint: config.endpoint,
        apiKey: config.apiKey,
        modelName: config.modelName,
      });
      break;
    case 'mock':
    default:
      activeProvider = new MockProvider();
  }
  return activeProvider;
};
