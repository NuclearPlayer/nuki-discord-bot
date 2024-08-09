import Logger from '../logger';
import { Client } from 'discord.js';

export const handleReady = (client: Client) => {
  client.on('ready', () => {
    Logger.info('Bot is ready.');
    Logger.info(`Logged in as ${client.user?.tag}!`);
  });
};
