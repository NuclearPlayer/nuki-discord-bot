import { chatbot } from '../directives/chatbot';
import { moderator } from '../directives/moderator';
import { Client } from 'discord.js';

export const handleMessageCreate = (client: Client) => {
  client.on('messageCreate', async (message) => {
    // await moderator.execute(client, message);
    await chatbot.execute(client, message);
  });
};
