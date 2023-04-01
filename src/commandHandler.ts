import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { Collection, CommandInteraction } from 'discord.js';

export type Command = {
  data: RESTPostAPIApplicationCommandsJSONBody;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

export class CommandHandler {
  private static _instance: CommandHandler;
  private static commands: Collection<string, Command> = new Collection();
  private constructor() {}

  static get instance(): CommandHandler {
    if (!CommandHandler._instance) {
      CommandHandler._instance = new CommandHandler();
    }

    return CommandHandler._instance;
  }

  register(command: Command) {
    CommandHandler.commands.set(command.data.name, command);
  }

  bulkRegister(commands: Command[]) {
    commands.forEach((command) => {
      CommandHandler.commands.set(command.data.name, command);
    });
  }

  get(name: string): Command | undefined {
    return CommandHandler.commands.get(name);
  }

  getRegisteringData(): RESTPostAPIApplicationCommandsJSONBody[] {
    return CommandHandler.commands.map((command) => command.data);
  }
}
