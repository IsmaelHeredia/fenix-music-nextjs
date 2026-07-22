import { PlaylistRepository } from '@/modules/playlists/domain/PlaylistRepository';

export class GetAllPlaylists {
  constructor(private repository: PlaylistRepository) { }

  execute() {
    return this.repository.findAll();
  }
}