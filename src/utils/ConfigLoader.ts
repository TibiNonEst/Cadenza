import { readFile } from 'fs/promises';
import { URL } from 'url';
import YAML from 'yaml';

import type Config from '../structures/Config';

export default class ConfigLoader {
  // TODO: Add config checks, default configs, etc
  async load(): Promise<Config> {
    const path = new URL('../../config.yml', import.meta.url);
    const data: string = await readFile(path, 'utf-8');
    const yaml = YAML.parse(data);

    for (const prop in yaml) {
      if (typeof yaml[prop] == 'object') {
        for (const prop2 in yaml[prop]) {
          yaml[prop][prop2] = process.env[`${prop}_${prop2}`] || yaml[prop][prop2];
        }
      } else {
        yaml[prop] = process.env[prop] || yaml[prop];
      }
    }

    yaml.lavaLink.port = typeof yaml.lavaLink.port === 'string' ? parseInt(yaml.lavaLink.port) : yaml.lavaLink.port;
    yaml.lavaLink.secure =
      typeof yaml.lavaLink.secure === 'string' ? yaml.lavaLink.secure === 'true' : yaml.lavaLink.secure;

    return yaml;
  }
}
