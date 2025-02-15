import { AIProvider } from '../types';
import { anthropic } from '@ai-sdk/anthropic';
import { CoreMessage, generateText } from 'ai';

export class AnthropicServiceProvider implements AIProvider {
  constructor() {}

  async generateResponse(messages: CoreMessage[]): Promise<string> {
    const response = await generateText({
      model: anthropic('claude-3-5-sonnet-latest'),
      maxTokens: 256,
      messages,
    });

    return response.text;
  }
}
