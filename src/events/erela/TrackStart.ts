import { MessageEmbed } from 'discord.js';
import PrettyMs from 'pretty-ms';
import { setTimeout } from 'timers/promises';

import type { Player } from 'erela.js';
import type Manager from '../../utils/Manager';
import type Track from '../../structures/Track';

export default class TrackStart {
  name = 'trackStart';

  async run(manager: Manager, player: Player, track: Track): Promise<void> {
    if (!player.textChannel) return;
    const channel = manager.client.channels.cache.get(player.textChannel);
    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor('Now playing ♪')
      .setThumbnail(track.displayThumbnail())
      .setDescription(`[${track.title}](${track.uri})`)
      .addField('Requested by', track.requester?.toString() || '', true)
      .addField('Duration', '`' + PrettyMs(track.duration, { colonNotation: true }) + '`', true);

    await manager.returnEmbed(channel, embed).then(async (message) => {
      if (!message) return;
      await setTimeout(300000);
      await message.delete();
    });
  }
}
