import { MessageEmbed } from 'discord.js';
import Pagination from '../utils/Pagination.js';
import ProgressBar from '../utils/ProgressBar.js';
import PrettyMs from 'pretty-ms';
import _ from 'lodash';

import type Command from '../structures/Command';
import type Manager from '../utils/Manager';
import type { Message } from 'discord.js';
import type Track from '../structures/Track';

export default class Queue implements Command {
  name = 'queue';
  aliases = ['q'];
  description = 'Show queued songs';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild || !message.member) return;
    const player = manager.erela.get(message.guild.id);
    if (!player) return manager.sendEmbed(message.channel, ':x: | **Nothing is playing right now...**', 'RED');
    if (!player.queue || !player.queue.totalSize || !player.queue.current)
      return manager.sendEmbed(message.channel, ':x: | **Nothing is in the queue**', 'RED');

    if (player.queue.size === 0) {
      const track = player.queue.current as Track;
      const embed = new MessageEmbed()
        .setAuthor('Nothing in the queue, currently playing ♪')
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

    const songs = player.queue.map((track, index) => {
      return { track, index };
    });
    const chunkedSongs = _.chunk(songs, 10);

    const pages = chunkedSongs.map((songs) => {
      const songList = songs
        .map(
          (song) =>
            `\`${song.index + 1}.\` [${song.track.title}](${song.track.uri})
            \`${PrettyMs(song.track.duration || 0, { colonNotation: true })}\` **|** Requested by: ${
              song.track.requester
            }`
        )
        .join('\n\n');

      return new MessageEmbed()
        .setAuthor('Queue')
        .setThumbnail(player.queue.current?.thumbnail || '')
        .setDescription(
          `**Currently Playing:**
          [${player.queue.current?.title}](${player.queue.current?.uri})\n
          **Up Next:**
          ${songList}`
        )
        .addField('Total Songs', player.queue.totalSize.toString(), true)
        .addField('Total Length', `\`${PrettyMs(player.queue.duration, { colonNotation: true })}\``, true);
    });

    if (!pages || pages.length === 0)
      return manager.sendEmbed(message.channel, ':x: **There was an error finding the queue**', 'RED');

    await message.react('👍');
    if (pages.length > 1) {
      await Pagination(message, pages, manager);
      return;
    }
    await manager.sendEmbed(message.channel, pages[0]);
  }
}
