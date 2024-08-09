import { loadEvents } from './events';
import Logger from './logger';
import { Client, GatewayIntentBits } from 'discord.js';

export class BotClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
      ],
    });
  }

  public async start(token: string): Promise<void> {
    Logger.info('Starting bot...');
    loadEvents(this);
    await this.login(token);
  }
}
