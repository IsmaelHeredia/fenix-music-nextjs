import { CustomPlaylistRepository } from '@/modules/custom-playlists/domain/CustomPlaylistRepository';

export class DeleteCustomPlaylist {
  constructor(private repo: CustomPlaylistRepository) {}

  async execute(id: number) {
    return await this.repo.delete(id);
  }
}