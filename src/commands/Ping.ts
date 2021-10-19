import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default class Ping implements Command {
  name = 'ping';
  description = 'See current api latency';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    await manager.sendEmbed(message.channel, `**Pong in \`${Math.round(manager.client.ws.ping)}ms\`**`);
  }
}
