import type { Node } from 'erela.js';
import type Manager from '../../utils/Manager';

export default class NodeError {
  name = 'nodeError';

  async run(manager: Manager, node: Node, error: Error): Promise<void> {
    manager.client.user?.setStatus('dnd');
    manager.client.user?.setActivity('Lavalink error', {
      type: 'PLAYING'
    });
    console.log(`Node '${node.options.identifier}' encountered an error: ${error.message}.`);
  }
}
