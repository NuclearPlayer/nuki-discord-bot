import { CommandHandler } from '../commandHandler';
import Logger from '../logger';
import { Client } from 'discord.js';

export const handleInteractionCreate = (client: Client) => {
  const handler = CommandHandler.instance;
  client.on('interactionCreate', async (interaction) => {
    try {
      if (!interaction.isCommand()) return;
    } catch (error) {
      Logger.error(error);
      return;
    }

    try {
      const command = handler.get(interaction.commandName);

      if (!command) return;
      await command.execute(interaction);
    } catch (error) {
      Logger.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  });
};
