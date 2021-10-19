import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default class Volume implements Command {
  name = 'volume';
  aliases = ['vol', 'v'];
  usage = '[volume]';
  description = 'Check or change the current volume';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild || !message.member) return;
    const player = manager.erela.get(message.guild.id);
    if (!message.member.voice.channel)
      return manager.sendEmbed(message.channel, ':x: | **You must be in a voice channel to use this command**', 'RED');
    if (!player) return manager.sendEmbed(message.channel, ':x: | **Nothing is playing right now...**', 'RED');
    if (!args[0]) return manager.sendEmbed(message.channel, `🔉 | Current volume \`${player.volume}\`.`);
    const vol = parseInt(args[0]);
    if (!vol || vol < 0 || vol > 100)
      return manager.sendEmbed(message.channel, `**Please choose a number between** \`1 - 100\``);
    player.setVolume(vol);
    await manager.sendEmbed(message.channel, `🔉 | **Volume set to** \`${player.volume}\``);
    await message.react('👍');
  }
}
