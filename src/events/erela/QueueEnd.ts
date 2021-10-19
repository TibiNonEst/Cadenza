import { MessageEmbed } from 'discord.js';

import type { Player } from 'erela.js';
import type Manager from '../../utils/Manager';

export default class QueueEnd {
  name = 'queueEnd';

  async run(manager: Manager, player: Player): Promise<void> {
    player.destroy();

    if (!player.textChannel) return;
    const channel = manager.client.channels.cache.get(player.textChannel);
    if (!channel) return;

    const embed = new MessageEmbed().setAuthor('The queue has ended').setTimestamp();

    await manager.sendEmbed(channel, embed);
  }
}
