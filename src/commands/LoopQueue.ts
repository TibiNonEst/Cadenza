import type Command from '../structures/Command';
import type { Message } from 'discord.js';
import type Manager from '../utils/Manager';

export default class LoopQueue implements Command {
  name = 'loopqueue';
  aliases = ['lq', 'repeatqueue', 'rq'];
  description = 'Loop the queue';

  async run(message: Message, args: string[], manager: Manager): Promise<void> {
    if (!message.guild || !message.member) return;
    const player = manager.erela.get(message.guild.id);
    if (!message.member.voice.channel)
      return manager.sendEmbed(message.channel, ':x: | **You must be in a voice channel to use this command**', 'RED');
    if (!player) return manager.sendEmbed(message.channel, ':x: | **Nothing is playing right now...**', 'RED');
    player.setQueueRepeat(!player.queueRepeat);
    await message.react('👍');
  }
}
