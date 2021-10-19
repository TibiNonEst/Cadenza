import { MessageEmbed, version } from 'discord.js';
import moment from 'moment';
import 'moment-duration-format';

import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default class Stats implements Command {
  name = 'stats';
  aliases = ['info'];
  description = 'Get information about the bot';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    const status = manager.erela.nodes.get(manager.config.lavaLink.identifier)?.connected;
    const embed = new MessageEmbed()
      .setTitle('Bot stats')
      .addField(':ping_pong: Ping', `┕\`${Math.round(manager.client.ws.ping)}ms\``, true)
      .addField(':clock1: Uptime', `┕\`${moment.duration(manager.client.uptime).format('D[d], H[h], m[m]')}\``, true)
      .addField(':file_cabinet: Memory', `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``, true)
      .addField(':radio: Lavalink', `┕\`${status ? 'Connected' : 'Not connected'}\``, true)
      .addField(':homes: Servers', `┕\`${manager.client.guilds.cache.size}\``, true)
      .addField(':loud_sound: Players', `┕\`${manager.erela.players.size}\``, true)
      .addField(':robot: Version', `┕\`v${process.env.npm_package_version || 'Unknown'}\``, true)
      .addField(':blue_book: Discord.js', `┕\`v${version}\``, true)
      .addField(':green_book: Node', `┕\`${process.version}\``, true);

    await manager.sendEmbed(message.channel, embed);
  }
}
