import type Command from '../../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../../utils/Manager';

export default class MessageCreate {
  name = 'messageCreate';

  async run(manager: Manager, message: Message): Promise<void> {
    if (!message.guild || message.author.bot || message.channel.type === 'DM') return;
    const mentionPrefix = `<@!${manager.client.user?.id}> `;
    const prefixString = (await manager.database.get(message.guild.id, 'prefix')) || manager.config.prefix;
    const prefix = message.content.startsWith(mentionPrefix) ? mentionPrefix : prefixString;

    if (!message.content.startsWith(prefix)) return;
    const [name, ...args] = message.content.slice(prefix.length).trim().split(/\s+/g);

    const command =
      manager.commands.get(name) ||
      manager.commands.find((cmd: Command): boolean => {
        return !!(cmd.aliases && cmd.aliases.includes(name));
      });
    if (!command) return;

    try {
      await command.run(message, args, manager);
    } catch (error) {
      await manager.sendEmbed(message.channel, `An error occurred while running the command: ${error}`, 'RED');
    }
  }
}
