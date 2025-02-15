import { AIFactory } from '../ai/factory';
import Logger from '../logger';
import { createAssistantMessage, createUserMessage } from '../open-ai-tools';
import { PromptBuilder } from '../prompt-builder';
import { CoreMessage, UserContent } from 'ai';
import { Client, Message } from 'discord.js';
import { random } from 'lodash';

export const chatbot = {
  execute: async (client: Client, message: Message) => {
    const chance = random(0, 100);

    if (
      (chance <= 6 || (client.user && message.mentions.has(client.user))) &&
      message.author.id !== client.user?.id &&
      !message.system
    ) {
      await message.channel.sendTyping();
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
      const lastMessages: CoreMessage[] = (
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
                ] satisfies CoreMessage['content'],
              });
            }

            const serverNickname = (
              message.guild?.members.cache.get(message.author.id)
                ?.displayName || ''
            ).replace(/[^a-zA-Z0-9_-]/g, '');

            const image = message.attachments.first()?.url;

            let content: CoreMessage['content'] = [
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
                  type: 'image',
                  image,
                },
              ] satisfies CoreMessage['content'];
            }

            return createUserMessage({
              content: content as UserContent,
              name: serverNickname.length > 0 ? serverNickname : undefined,
            });
          }),
        )
      ).reverse();

      Logger.info('Querying AI API...');
      const aiFactory = AIFactory.getInstance();
      const response = await aiFactory
        .getCurrentProvider()
        .generateResponse([
          { role: 'system', content: prompt },
          ...lastMessages,
        ]);

      await message.channel.send(
        response
          .replace('Nuki:', '')
          .replace('Nuki[id:1087848070512910336]:', '')
          .replace(
            new RegExp(
              `\\[\\d{1,2}\\/\\d{1,2}\\/\\d{4}, \\d{1,2}:\\d{1,2}:\\d{1,2} [AP]M\\] ?`,
              'g',
            ),
            '',
          ),
      );
    }
  },
};
