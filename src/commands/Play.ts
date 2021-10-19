import { MessageEmbed } from 'discord.js';
import PrettyMs from 'pretty-ms';

import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';
import type Track from '../structures/Track';

export default class Play implements Command {
  name = 'play';
  aliases = ['p', 'search'];
  usage = '<song>';
  description = 'Play a song';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild || !message.member) return;
    if (!message.member.voice.channel)
      return manager.sendEmbed(message.channel, ':x: | **You must be in a voice channel to use this command**', 'RED');
    if (!args.length) return manager.sendEmbed(message.channel, `**Usage - **\`${manager.config.prefix}play [song]\``);

    const search = args.join(' ');
    const res = await manager.erela.search(search, message.author);

    if (res.loadType === 'LOAD_FAILED')
      return manager.sendEmbed(message.channel, res.exception?.message || 'Search failed', 'RED');
    if (res.loadType === 'NO_MATCHES')
      return manager.sendEmbed(message.channel, 'No results found for search: `' + search + '`', 'RED');

    const player = manager.erela.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id
    });

    if (!player) return manager.sendEmbed(message.channel, '**Player could not be found**', 'RED');

    if (player.state !== 'CONNECTED') await player.connect();

    const response = await message.channel.send('Searching :mag_right: `' + search + '`');

    const track = res.tracks[0] as Track;
    const embed = new MessageEmbed();

    switch (res.loadType) {
      case 'PLAYLIST_LOADED':
        player.queue.add(res.tracks);
        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) await player.play();
        embed
          .setAuthor('Added playlist to queue', track.requester?.displayAvatarURL())
          .setThumbnail(res.tracks[0].thumbnail || '')
          .setDescription(`[${res.playlist?.name}](${search})`)
          .addField('Added', res.tracks.length + ' tracks')
          .addField(
            'Playlist duration',
            '`' +
              PrettyMs(res.playlist?.duration || 0, {
                colonNotation: true
              }) +
              '`'
          );
        break;
      case 'TRACK_LOADED':
      case 'SEARCH_RESULT':
        player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.size) await player.play();
        embed
          .setAuthor('Added to queue', track.requester?.displayAvatarURL())
          .setThumbnail(res.tracks[0].thumbnail || '')
          .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
          .addField('Channel', res.tracks[0].author, true)
          .addField(
            'Duration',
            '`' +
              PrettyMs(res.tracks[0].duration, {
                colonNotation: true
              }) +
              '`',
            true
          )
          .addField('Position in queue', player.queue.size.toString(), true);
        break;
    }

    await message.react('👍');
    if (response && response.deletable && !response.deleted) response.delete();
    if (player.queue.size) await manager.sendEmbed(message.channel, embed);
  }
}
