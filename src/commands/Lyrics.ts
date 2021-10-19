import { MessageEmbed } from 'discord.js';
import Genius from 'genius-lyrics';
import _ from 'lodash';
import Pagination from '../utils/Pagination.js';

import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default class Lyrics implements Command {
  name = 'lyrics';
  aliases = ['ly'];
  usage = '[song]';
  description = 'Get the lyrics of a song';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild || !message.member) return;
    const player = manager.erela.get(message.guild.id);
    let search = args.join(' ');
    if (!args[0]) {
      if (!player || !player.queue.current)
        return manager.sendEmbed(message.channel, ':x: | **Nothing is playing right now...**', 'RED');
      search = player.queue.current.title;
    }
    const title = search.replace(
      /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+])/gi,
      ''
    );

    const geniusClient = new Genius.Client();
    const song = await geniusClient.songs.search(title);
    const lyrics = await song[0].lyrics();
    if (!lyrics) return manager.sendEmbed(message.channel, '**No lyrics found for -** `' + title + '`');

    const lines = lyrics.split('\n');
    const chunkedLyrics = _.chunk(lines, 30);

    const pages = chunkedLyrics.map((lines) => {
      return new MessageEmbed().setAuthor(`Lyrics for ${title}`).setDescription(lines.join('\n'));
    });

    if (!pages || pages.length === 0)
      return manager.sendEmbed(message.channel, ':x: **There was a problem finding the lyrics**', 'RED');

    if (pages.length > 1) {
      await Pagination(message, pages, manager);
      return;
    }
    await manager.sendEmbed(message.channel, pages[0]);
  }
}
