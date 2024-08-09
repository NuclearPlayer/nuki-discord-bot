import { Client } from 'discord.js';
import { ChatCompletionTool } from 'openai/resources';

export type Tool = {
  name: string;
  definition: () => ChatCompletionTool;
  execute: (client: Client) => Promise<void>;
};
