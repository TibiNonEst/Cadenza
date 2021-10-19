import type { User } from 'discord.js';
import type { Track as ErelaTrack } from 'erela.js';

export default interface Track extends ErelaTrack {
  requester: User | null;
}
