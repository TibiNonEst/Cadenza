import type Manager from '../../utils/Manager';

export default class Ready {
  name = 'ready';

  async run(manager: Manager): Promise<void> {
    manager.erela.init(manager.client.user?.id);
    manager.client.user?.setStatus('idle');
    manager.client.user?.setActivity('starting...', {
      type: 'PLAYING'
    });
    console.log(`Logged in as ${manager.client.user?.tag}`);
  }
}
