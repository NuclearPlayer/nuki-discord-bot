import { AIProvider } from '../types';
import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateText } from 'ai';

export class OpenAIServiceProvider implements AIProvider {
  constructor() {}

  async generateResponse(messages: CoreMessage[]): Promise<string> {
    const response = await generateText({
      model: openai('gpt-4o'),
      messages,
      maxTokens: 256,
    });

    return response.text;
  }
}
