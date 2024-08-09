import { CommandHandler } from './commandHandler';
import Logger from './logger';
import { OpenAiApiService } from './open-ai-api-service';
import { createAssistantMessage, createUserMessage } from './open-ai-tools';
import { PromptBuilder } from './prompt-builder';
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { random } from 'lodash';
import { OpenAI } from 'openai';
import {
  ChatCompletionContentPart,
  ChatCompletionUserMessageParam,
} from 'openai/resources';

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
    this.once('ready', () => {
      Logger.info('Bot is ready.');
      Logger.info(`Logged in as ${this.user?.tag}!`);
    });

    this.on('error', (error) => {
      Logger.error(`Received error: ${error}`);
    });

    this.on('messageCreate', async (message) => {
      const chance = random(0, 100);

      if (
        (chance <= 6 || (this.user && message.mentions.has(this.user))) &&
        message.author.id !== this.user?.id
      ) {
        await message.channel.sendTyping();
        const openAiService = new OpenAiApiService();
        const availableEmoji = message.guild?.emojis.cache.map((emoji) => ({
          id: emoji.id,
          name: emoji.name ?? '',
        }));
        const prompt = new PromptBuilder()
          .withCurrentPersonality()
          .withCreatorInfo()
          .withNuclearInfo()
          .withCustomEmoji(availableEmoji)
          .build();
        const lastMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
          (
            await Promise.all(
              (
                await message.channel.messages.fetch({ limit: 30 })
              )
                .map(async (message: Message) => {
                  const isNukisMessage = message.author.id === this.user?.id;

                  if(isNukisMessage) {
                    return createAssistantMessage({
                      content: [{
                        type: 'text',
                        text: `[${new Date(message.createdTimestamp).toLocaleString()}]: ${message.content}`
                      }]
                    })
                  }

                  const serverNickname = message.guild?.members.cache.get(
                    message.author.id,
                  )?.displayName;

                  const image = message.attachments.first()?.url;

                  let content: ChatCompletionContentPart[] = [{
                    type: 'text', 
                    text: `[${new Date(message.createdTimestamp).toLocaleString()}]: ${message.content}`
                  }];

                  if (
                    (image && image?.endsWith('.gif')) ||
                    image?.endsWith('.png') ||
                    image?.endsWith('.jpg') ||
                    image?.endsWith('.jpeg') ||
                    image?.endsWith('.webp')
                  ) {
                    content = [
                      {
                        type: 'text',
                        text: content,
                      },
                      {
                        type: 'image_url',
                        image_url: {
                          detail: 'low',
                          url: image,
                        },
                      },
                    ] as ChatCompletionContentPart[];
                  }                

                  return createUserMessage({
                    content,
                    name: `${serverNickname}[id:${message.author.id}]`,
                  });
                }),
            )
          ).reverse();

        Logger.info('Querying OpenAI API...');
        const messageToSend = await openAiService
          .getClient()
          .chat.completions.create({
            max_tokens: 256,
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }, ...lastMessages],
          });

        await message.channel.send(
          messageToSend.choices[0].message?.content
            ?.replace('Nuki:', '')
            .replace('Nuki[id:1087848070512910336]:', '')
            .replace(
              new RegExp(
                `\\[\\d{1,2}\\/\\d{1,2}\\/\\d{4}, \\d{1,2}:\\d{1,2}:\\d{1,2} [AP]M\\] ?`,
                'g',
              ),
              '',
            )!,
        );
      }
    });

    const handler = CommandHandler.instance;
    this.on('interactionCreate', async (interaction) => {
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

    await this.login(token);
  }
}
