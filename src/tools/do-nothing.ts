import { Tool } from '.';

export const doNothingTool: Tool = {
  name: 'do-nothing',
  definition: () => ({
    function: {
      name: 'do-nothing',
      description:
        "Do nothing. If you deem the message to be fine, use this tool. If you're not sure about the message, leave it to the human moderators, and do nothing.",
      parameters: {
        type: 'object',
        properties: {
          reason: {
            type: 'string',
            description: 'The reason for doing nothing about this message.',
          },
        },
      },
    },
    type: 'function',
  }),
  execute: async () => {},
};
