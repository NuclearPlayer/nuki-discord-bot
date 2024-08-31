import Logger from '../logger';
import { OpenAiApiService } from '../open-ai-api-service';
import { createAssistantMessage, createUserMessage } from '../open-ai-tools';
import { PromptBuilder } from '../prompt-builder';
import { Client, Message } from 'discord.js';
import { random } from 'lodash';
import {
  ChatCompletionContentPart,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';

export const chatbot = {
  execute: async (client: Client, message: Message) => {
    const chance = random(0, 100);

    if (
      (chance <= 6 || (client.user && message.mentions.has(client.user))) &&
      message.author.id !== client.user?.id &&
      !message.system
    ) {
      await message.channel.sendTyping();
      const openAiService = new OpenAiApiService();
      const availableEmoji = message.guild?.emojis.cache.map((emoji) => ({
        id: emoji.id,
        name: emoji.name ?? '',
      }));
      const prompt = new PromptBuilder()
        .withChatbotPrompt()
        .withCurrentPersonality()
        .withCreatorInfo()
        .withNuclearInfo()
        .withCustomEmoji(availableEmoji)
        .withChatbotFooter()
        .build();
      const lastMessages: ChatCompletionMessageParam[] = (
        await Promise.all(
          (
            await message.channel.messages.fetch({ limit: 30 })
          ).map(async (message: Message) => {
            const isNukisMessage = message.author.id === client.user?.id;

            if (isNukisMessage) {
              return createAssistantMessage({
                content: [
                  {
                    type: 'text',
                    text: `[${new Date(
                      message.createdTimestamp,
                    ).toLocaleString()}]: ${message.content}`,
                  },
                ],
              });
            }

            const serverNickname = (
              message.guild?.members.cache.get(message.author.id)
                ?.displayName || ''
            ).replace(/[^a-zA-Z0-9_-]/g, '');

            const image = message.attachments.first()?.url;

            let content: ChatCompletionContentPart[] = [
              {
                type: 'text',
                text: `[${new Date(
                  message.createdTimestamp,
                ).toLocaleString()}]: ${message.content}`,
              },
            ];

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
                  text: `[id:${message.author.id}]:${content}`,
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
              name: serverNickname.length > 0 ? serverNickname : undefined,
            });
          }),
        )
      ).reverse();

      Logger.info('Querying OpenAI API...');
      const messageToSend = await openAiService
        .getClient()
        .chat.completions.create({
          max_tokens: 256,
          model: 'gpt-4o-2024-08-06',
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
  },
};
