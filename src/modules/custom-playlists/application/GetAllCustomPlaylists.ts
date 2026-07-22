import { CustomPlaylistRepository } from '@/modules/custom-playlists/domain/CustomPlaylistRepository';

export class GetAllCustomPlaylists {
  constructor(private repo: CustomPlaylistRepository) {}

  async execute() {
    return await this.repo.findAll();
  }
}