import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default interface Command {
  name: string;
  aliases?: string[];
  usage?: string;
  description: string;
  run(message: Message, args: string[], manager: Manager): Promise<void>;
}
