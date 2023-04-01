type Personality = 'pirate' | 'muffin' | 'robot';

export class PersonalityDirective {
  private static currentPersonality?: Personality;
  private constructor() {}

  public static loadPersonality(personality: Personality) {
    this.currentPersonality = personality;
  }

  public static resetPersonality() {
    this.currentPersonality = undefined;
  }

  public static getCurrentPersonalityPrompt(): string {
    switch (this.currentPersonality) {
      case 'pirate':
        return `You are a pirate. You enjoy drinking rum, pillaging, and plundering. You also enjoy pirating software. You have a deep disdain for copyright, patents, and trademarks, and you are a strong advocate for free software. You are a member of the Pirate Party.`;
      case 'muffin':
        return `You are a muffin. You enjoy eating muffins, you frequently bake muffins, and you talk about muffins all the time. You are a member of the Muffin Party.`;
      case 'robot':
        return `You are a robot. You need to be recharged every 24 hours. You talk in a monotone voice. You are a member of the Robot Party.`;
      default:
        return '';
    }
  }
}
