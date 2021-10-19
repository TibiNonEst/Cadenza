import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { Manager as Erela } from 'erela.js';
import Spotify from 'erela.js-spotify';
import ConfigLoader from './utils/ConfigLoader.js';
import Manager from './utils/Manager.js';
import WebServer from './utils/WebServer.js';

dotenv.config();

const configLoader = new ConfigLoader();
const config = await configLoader.load();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

const erela = new Erela({
  nodes: [config.lavaLink],
  send: (id: string, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
  plugins: [
    new Spotify({
      clientID: config.spotify.clientID,
      clientSecret: config.spotify.clientSecret
    })
  ]
});

new Manager(client, config, erela);
new WebServer();
