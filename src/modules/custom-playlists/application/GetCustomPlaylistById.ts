import { CustomPlaylistRepository } from '@/modules/custom-playlists/domain/CustomPlaylistRepository';

export class GetCustomPlaylistById {
  constructor(private repo: CustomPlaylistRepository) {}

  async execute(id: number) {
    return await this.repo.findById(id);
  }
}