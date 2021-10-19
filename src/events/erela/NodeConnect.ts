import type { Node } from 'erela.js';
import type Manager from '../../utils/Manager';

export default class NodeConnect {
  name = 'nodeConnect';

  async run(manager: Manager, node: Node): Promise<void> {
    manager.client.user?.setStatus('online');
    manager.client.user?.setActivity('music', { type: 'LISTENING' });
    console.log(`Node '${node.options.identifier}' connected.`);
  }
}
