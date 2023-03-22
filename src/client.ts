import Logger from './logger';
import { OpenAiApiService } from './open-ai-api-service';
import { PromptBuilder } from './prompt-builder';
import { Client, GatewayIntentBits, GuildChannel, Message } from 'discord.js';
import { random } from 'lodash';
import { ChatCompletionRequestMessage } from 'openai';

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

      if (chance <= 25 && message.author.id !== this.user?.id) {
        const openAiService = new OpenAiApiService();
        const availableEmoji = message.guild?.emojis.cache.map((emoji) => ({
          id: emoji.id,
          name: emoji.name ?? '',
        }));
        const prompt = new PromptBuilder()
          .withCustomEmoji(availableEmoji)
          .withCreatorInfo()
          .build();
        const lastTenMessages: ChatCompletionRequestMessage[] = (
          await message.channel.messages.fetch({ limit: 10 })
        )
          // @ts-ignore
          .map((message: Message) => ({
            role: message.author.id === this.user?.id ? 'assistant' : 'user',
            content: `${message.author.username}[id:${message.author.id}]: ${message.content}`,
          }))
          .reverse();

        Logger.info('Querying OpenAI API...');
        Logger.debug(`System prompt: ${prompt}`);
        Logger.debug(`Last messages: ${JSON.stringify(lastTenMessages)}`);
        const messageToSend = await openAiService
          .getClient()
          .createChatCompletion({
            max_tokens: 256,
            model: 'gpt-3.5-turbo-0301',
            messages: [{ role: 'system', content: prompt }, ...lastTenMessages],
          });

        await message.channel.send(
          messageToSend.data.choices[0].message?.content!,
        );
      }
    });

    await this.login(token);
  }
}
