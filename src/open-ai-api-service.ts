import { Configuration, OpenAIApi } from 'openai';

export class OpenAiApiService {
  private client: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.client = new OpenAIApi(configuration);
  }

  getClient() {
    return this.client;
  }
}
