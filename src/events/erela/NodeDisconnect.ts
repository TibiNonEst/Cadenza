import { setTimeout } from 'timers/promises';

import type { Node } from 'erela.js';
import type Manager from '../../utils/Manager';

export default class NodeDisconnect {
  name = 'nodeDisconnect';

  async run(manager: Manager, node: Node): Promise<void> {
    manager.client.user?.setStatus('dnd');
    manager.client.user?.setActivity('Lavalink disconnected', {
      type: 'PLAYING'
    });
    console.log(`Node '${node.options.identifier}' disconnected, attempting to reconnect.`);
    await setTimeout(5000);
    node.connect();
  }
}
