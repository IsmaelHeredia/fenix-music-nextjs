import { CustomPlaylistRepository } from '@/modules/custom-playlists/domain/CustomPlaylistRepository';

export class ManageCustomPlaylist {
  constructor(private repo: CustomPlaylistRepository) {}

  async execute(name: string, songIds: number[]) {
    const items = songIds.map((songId, index) => ({ songId, order: index }));
    await this.repo.save(name, items);
  }
}