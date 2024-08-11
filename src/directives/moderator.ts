import { safeParse } from '../json-utils';
import Logger from '../logger';
import { OpenAiApiService } from '../open-ai-api-service';
import { PromptBuilder } from '../prompt-builder';
import { banTool } from '../tools/ban-tool';
import { doNothingTool } from '../tools/do-nothing';
import { Client, Message } from 'discord.js';
import { has } from 'lodash';

export const moderator = {
  execute: async (client: Client, message: Message) => {
    const isNukisMessage = message.author.id === client.user?.id;

    if (isNukisMessage || message.system) {
      return;
    }
    const prompt = new PromptBuilder()
      .withModeratorPrompt()
      .withCreatorInfo()
      .build();

    const serverNickname = message.guild?.members.cache
      .get(message.author.id)
      ?.displayName.replace(/[^a-zA-Z0-9_-]+/g, '');

    // Use sanitizedNickname in your code
    const channelName = message.channel.isDMBased()
      ? 'DM'
      : message.channel.name;

    Logger.info('Querying OpenAI API for moderation...');
    const openAiService = new OpenAiApiService();
    const response = await openAiService.getClient().chat.completions.create({
      max_tokens: 256,
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
        {
          role: 'user',
          content: `[channel:#${channelName}][id:${message.author.id}]:${message.content}`,
          name: serverNickname,
        },
      ],
      tool_choice: 'required',
      tools: [banTool.definition(), doNothingTool.definition()],
      parallel_tool_calls: false,
    });

    const choice = response.choices[0];
    const toolCall = choice.message?.tool_calls?.[0];

    if (toolCall) {
      const toolCallBody = safeParse(toolCall?.function.arguments!);
      const toolCallName = toolCall?.function.name;

      if (toolCallName === banTool.name) {
        Logger.info('Nuki used the banhammer!');
        Logger.info(`Banhammer arguments: ${JSON.stringify(toolCallBody)}`, {
          message: message.content,
        });

        await message.member?.ban({
          deleteMessageSeconds: toolCallBody.deleteMessageSeconds,
        });

        if (toolCallBody.message) {
          await message.channel.send(toolCallBody.message);
        }
      } else {
        Logger.info(`Tool call name: ${toolCallName}`);
        Logger.info(`Tool call arguments: ${JSON.stringify(toolCallBody)}`);
      }
    } else {
      Logger.info('No tool call was made.');
    }
  },
};
