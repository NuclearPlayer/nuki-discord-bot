import { OpenAI } from 'openai';

export class OpenAiApiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  getClient() {
    return this.client;
  }
}
