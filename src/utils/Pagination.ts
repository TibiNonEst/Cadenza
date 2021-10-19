import type { Message, MessageEmbed, MessageReaction, User } from 'discord.js';
import type Manager from './/Manager';

export default async (
  message: Message,
  pages: MessageEmbed[],
  manager: Manager,
  emojiList = ['◀️', '▶'],
  timeout = 150_000
): Promise<Message | void> => {
  if (!message || !message.channel) return;
  if (!pages) return;

  let page = 0;
  const embedMessage = await manager.returnEmbed(
    message.channel,
    pages[page]
      .setFooter(`Page ${page + 1}/${pages.length}`, message.author.displayAvatarURL({ dynamic: true }))
      .setColor('RANDOM')
  );
  if (!embedMessage) return;

  const color = pages[0].color || 'RANDOM';

  for (const emoji of emojiList) {
    await embedMessage.react(emoji);
  }

  const filter = (reaction: MessageReaction, user: User) =>
    emojiList.includes(<string>reaction.emoji.name) && !user.bot;
  const collector = embedMessage.createReactionCollector({
    filter,
    time: timeout
  });

  collector.on('collect', (reaction: MessageReaction, user: User): void => {
    reaction.users.remove(user);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[1]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
    }

    embedMessage.edit({
      embeds: [
        pages[page]
          .setFooter(`Page ${page + 1}/${pages.length}`, message.author.displayAvatarURL({ dynamic: true }))
          .setColor(color)
      ]
    });
  });

  collector.on('end', (): void => {
    if (!embedMessage.deleted) {
      embedMessage.reactions.removeAll();
    }
  });

  return embedMessage;
};
