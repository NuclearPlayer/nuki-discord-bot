import Logger from './logger';
import Replicate from 'replicate';

export class ReplicateService {
  private static instance: ReplicateService;
  private client: Replicate;
  private captionCache: Map<string, string> = new Map();

  private constructor() {
    this.client = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });
  }

  static getInstance() {
    if (!ReplicateService.instance) {
      ReplicateService.instance = new ReplicateService();
    }

    return ReplicateService.instance;
  }

  getClient() {
    return this.client;
  }

  async getCaption(image: string) {
    if (this.captionCache.has(image)) {
      return this.captionCache.get(image) as string;
    }

    const result: string = (await this.client.run(
      'salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
      {
        input: {
          image,
        },
      },
    )) as unknown as string;

    this.captionCache.set(image, result);
    Logger.debug(result);
    return result;
  }
}
