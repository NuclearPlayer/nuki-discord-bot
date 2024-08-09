import { handleError } from './error';
import { handleInteractionCreate } from './interactionCreate';
import { handleMessageCreate } from './messageCreate';
import { handleReady } from './ready';
import { Client } from 'discord.js';

export const loadEvents = async (client: Client): Promise<void> => {
  handleReady(client);
  handleError(client);
  handleInteractionCreate(client);
  handleMessageCreate(client);
};
