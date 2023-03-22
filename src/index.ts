import { BotClient } from './client';
import dotenv from 'dotenv';

(async () => {
  dotenv.config();
  await new BotClient().start(process.env.TOKEN!);
})();
