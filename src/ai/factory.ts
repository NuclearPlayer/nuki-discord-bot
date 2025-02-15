import { AnthropicServiceProvider } from './providers/anthropic-provider';
import { OpenAIServiceProvider } from './providers/openai-provider';
import { AIModelProvider, AIProvider } from './types';

export class AIFactory {
  private static instance: AIFactory;
  private currentProvider: AIProvider;
  private providers: Map<AIModelProvider, AIProvider>;

  private constructor() {
    this.providers = new Map();
    this.providers.set(AIModelProvider.OPENAI, new OpenAIServiceProvider());
    this.providers.set(
      AIModelProvider.ANTHROPIC,
      new AnthropicServiceProvider(),
    );
    this.currentProvider = this.providers.get(AIModelProvider.ANTHROPIC)!;
  }

  static getInstance(): AIFactory {
    if (!AIFactory.instance) {
      AIFactory.instance = new AIFactory();
    }
    return AIFactory.instance;
  }

  setProvider(provider: AIModelProvider): void {
    const newProvider = this.providers.get(provider);
    if (!newProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    this.currentProvider = newProvider;
  }

  getCurrentProvider(): AIProvider {
    return this.currentProvider;
  }
}
