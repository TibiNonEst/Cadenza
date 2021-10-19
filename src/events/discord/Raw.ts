import type { VoicePacket } from 'erela.js';
import type Manager from '../../utils/Manager';

export default class Raw {
  name = 'raw';

  async run(manager: Manager, data: VoicePacket): Promise<void> {
    manager.erela.updateVoiceState(data);
  }
}
