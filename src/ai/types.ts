import { CoreMessage } from 'ai';

export interface AIProvider {
  generateResponse(messages: CoreMessage[]): Promise<string>;
}

export enum AIModelProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
}
