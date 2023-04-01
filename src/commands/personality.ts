import { Command } from '../commandHandler';
import { Personality, PersonalityDirective } from '../personality-directive';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { isEmpty } from 'lodash';

export const PersonalityCommand: Command = {
  data: new SlashCommandBuilder()
    .addStringOption((option) =>
      option
        .setName('personality')
        .setDescription('Add a personality directive to the bot.')
        .addChoices(
          { name: 'Pirate', value: 'pirate' },
          { name: 'Muffin', value: 'muffin' },
          { name: 'Robot', value: 'robot' },
          { name: 'None', value: 'none' },
        ),
    )
    .setName('personality')
    .setDescription('Add a personality directive to the bot.')
    .toJSON(),
  async execute(interaction: CommandInteraction) {
    const newPersonality = interaction.options.get('personality')?.value;
    if (newPersonality === 'none') {
      PersonalityDirective.resetPersonality();
      await interaction.reply({
        content: `Personality directive reset.`,
        ephemeral: true,
      });
      return;
    } else if (!isEmpty(newPersonality)) {
      PersonalityDirective.loadPersonality(newPersonality as Personality);
      await interaction.reply({
        content: `Personality directive loaded.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `No personality directive provided.`,
        ephemeral: true,
      });
    }

    return;
  },
};
