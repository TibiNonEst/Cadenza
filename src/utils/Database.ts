import Keyv from 'keyv';

import type Config from '../structures/Config';

export default class Database {
  config: Config;
  connections: { [id: string]: Keyv };

  constructor(config: Config) {
    this.config = config;
    this.connections = {};
  }

  async get(namespace: string, key: string): Promise<string> {
    if (!this.connections[namespace]) this.connections[namespace] = await this.createConnection(namespace);
    return await this.connections[namespace].get(key);
  }

  async set(namespace: string, key: string, value: string): Promise<void> {
    if (!this.connections[namespace]) this.connections[namespace] = await this.createConnection(namespace);
    await this.connections[namespace].set(key, value);
  }

  async createConnection(namespace: string): Promise<Keyv> {
    const options = this.config.database.options;

    const base = `${options.user}:${options.password}@${options.host}`;
    let address;
    switch (this.config.database.type) {
      case 'redis':
        address = `redis://${base}:${options.port}`;
        break;
      case 'mongo':
        address = `mongodb://${base}/${options.database}`;
        break;
      case 'sqlite':
        address = `sqlite://${options.host}`;
        break;
      case 'postgres':
        address = `postgresql://${base}/${options.database}`;
        break;
      case 'mysql':
        address = `mysql://${base}/${options.database}`;
        break;
    }

    return new Keyv(address, { namespace }).on('error', (err) => console.error('Keyv connection error:', err));
  }
}
