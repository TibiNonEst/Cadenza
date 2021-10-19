import { MessageEmbed } from 'discord.js';
import PrettyMs from 'pretty-ms';
import ProgressBar from '../utils/ProgressBar.js';

import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';
import type Track from '../structures/Track';

export default class Nowplaying implements Command {
  name = 'nowplaying';
  aliases = ['np'];
  description = "See what's currently playing";

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild) return;
    const player = manager.erela.get(message.guild.id);
    if (!player || !player.queue || !player.queue.current)
      return manager.sendEmbed(message.channel, ':x: | **Nothing is playing right now...**', 'RED');

    const track = player.queue.current as Track;
    const embed = new MessageEmbed()
      .setAuthor('Currently playing ♪')
      .setThumbnail(track.thumbnail || '')
      .setDescription(`[${track.title}](${track.uri})`)
      .addField('Requested by', track.requester?.toString() || '', true)
      .addField(
        'Duration',
        `${await ProgressBar(player.position, track.duration, 15)} \`${PrettyMs(player.position, {
          colonNotation: true
        })} / ${PrettyMs(track.duration, { colonNotation: true })}\``,
        true
      );
    return manager.sendEmbed(message.channel, embed);
  }
}
