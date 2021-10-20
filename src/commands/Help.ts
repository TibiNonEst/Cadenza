import { MessageEmbed } from 'discord.js';

import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default class Help implements Command {
  name = 'help';
  aliases = ['commands'];
  description = 'Learn about the bot commands';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild) return;
    const prefix = (await manager.database.get(message.guild.id, 'prefix')) || manager.config.prefix;
    const commands = manager.commands.map(
      (command) => `\`${prefix + command.name}${command.usage ? ' ' + command.usage : ''}\` - ${command.description}`
    );
    const embed = new MessageEmbed().setTitle('Bot commands').setDescription(
      `${commands.join('\n')}\n
       Cadenza v${process.env.npm_package_version}
       [Github](https://github.com/TibiNonEst/Cadenza) | by [TibiNonEst](https://github.com/TibiNonEst)`
    );
    await manager.sendEmbed(message.channel, embed);
  }
}
