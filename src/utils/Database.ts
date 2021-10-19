import Keyv from 'keyv';

import type Config from '../structures/Config';

export default class Database extends Keyv {
  constructor(config: Config) {
    const options = config.database.options;

    const base = `${options.user}:${options.password}@${options.host}`;
    let address;
    switch (config.database.type) {
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

    super(address);
    this.on('error', (err) => console.error('Keyv connection error:', err));
  }
}
