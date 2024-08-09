import Logger from '../logger';
import { Client } from 'discord.js';

export const handleError = (client: Client) => {
  client.on('error', (error) => {
    Logger.error(`Received error: ${error}`);
  });
};
