import { Collection, MessageEmbed } from 'discord.js';
import { readdir } from 'fs/promises';
import { URL } from 'url';

import type Command from '../structures/Command';
import type Config from '../structures/Config';
import type Database from '../utils/Database';
import type { Channel, Client, ColorResolvable, Message, TextBasedChannels, TextChannel } from 'discord.js';
import type { Manager as Erela } from 'erela.js';

export default class Manager {
  client: Client;
  config: Config;
  erela: Erela;
  commands: Collection<string, Command>;
  database: Database;

  constructor(client: Client, config: Config, erela: Erela, database: Database) {
    this.client = client;
    this.config = config;
    this.erela = erela;
    this.commands = new Collection();
    this.database = database;

    Promise.all([this.loadCommands(), this.loadEvents()]).then(() => {
      client.login(config.token);
    });
  }

  async loadCommands(): Promise<void> {
    const files = (await readdir(new URL('../commands', import.meta.url))).filter((file: string) =>
      file.endsWith('.js')
    );
    for (const file of files) {
      const commandClass = await import(new URL(`../commands/${file}`, import.meta.url).toString());
      const command = new commandClass.default();
      this.commands.set(command.name, command);
      console.log('Added command', command.name);
    }
  }

  async loadEvents(): Promise<void> {
    const folders = await readdir(new URL('../events', import.meta.url));
    for (const folder of folders) {
      const eventFiles = (await readdir(new URL(`../events/${folder}`, import.meta.url))).filter((file: string) =>
        file.endsWith('.js')
      );
      for (const file of eventFiles) {
        const eventClass = await import(new URL(`../events/${folder}/${file}`, import.meta.url).toString());
        const event = new eventClass.default();
        if (folder === 'erela') {
          this.erela.on(event.name, (...args) => event.run(this, ...args));
          console.log('Added', folder, 'event', event.name);
        } else if (folder === 'discord') {
          this.client.on(event.name, (...args) => event.run(this, ...args));
          console.log('Added', folder, 'event', event.name);
        } else {
          console.log('Event type not found.');
        }
      }
    }
  }

  async returnEmbed(
    channel: Channel | TextBasedChannels,
    content: string | MessageEmbed,
    color: string = this.config.embedColor
  ): Promise<void | Message> {
    let embed;
    if (content instanceof MessageEmbed) {
      if (!content.color) content.setColor(color as ColorResolvable);
      embed = content;
    } else embed = new MessageEmbed().setColor(color as ColorResolvable).setDescription(content);

    if (channel.type === 'GUILD_TEXT') return (channel as TextChannel).send({ embeds: [embed] });
  }

  async sendEmbed(
    channel: Channel | TextBasedChannels,
    content: string | MessageEmbed,
    color: string = this.config.embedColor
  ): Promise<void> {
    await this.returnEmbed(channel, content, color);
  }

  async dbGet(guildID: string, key: string): Promise<string> {
    return await this.database.get(guildID + '_' + key);
  }

  async dbSet(guildID: string, key: string, value: string): Promise<void> {
    await this.database.set(guildID + '_' + key, value);
  }
}
