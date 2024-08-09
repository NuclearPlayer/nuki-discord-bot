import { Tool } from '.';

export const banTool: Tool = {
  name: 'ban',
  definition: () => ({
    function: {
      name: 'ban',
      description:
        'Confirm that you want to issue a ban for the above message. Only ban people in extremely clear cases, such as sending scam links or outright spam. Delete the last messages when banning someone. NEVER try banning the server admins, moderators, or your creator. If you\'re not sure, use the "do nothing" tool instead.',
      parameters: {
        type: 'object',
        properties: {
          deleteMessageSeconds: {
            type: 'number',
            description:
              "Also delete the user's messages from the past x seconds.",
          },
          reason: {
            type: 'string',
            description:
              'The reason for the ban. Moderators will see this, so put something useful here.',
          },
          message: {
            type: 'string',
            description:
              'Message for the users of the server, informing them that you banned the user.',
          },
        },
        required: ['deleteMessageSeconds', 'reason', 'message'],
      },
    },
    type: 'function',
  }),
  execute: async () => {},
};
