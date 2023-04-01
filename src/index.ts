import { BotClient } from './client';
import { CommandHandler } from './commandHandler';
import { PersonalityCommand } from './commands/personality';
import Logger from './logger';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

(async () => {
  dotenv.config();
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN ?? '');
  const handler = CommandHandler.instance;
  handler.register(PersonalityCommand);

  await rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID ?? ''), {
      body: handler.getRegisteringData(),
    })
    .then(() => Logger.info('Successfully registered application commands.'))
    .catch(Logger.error);

  await new BotClient().start(process.env.TOKEN!);
})();
