import { LiveStreamRepository } from '@/modules/livestreams/domain/LiveStreamRepository';
export class DeleteLiveStream {
  constructor(private repo: LiveStreamRepository) {}
  async execute(id: number) { return await this.repo.delete(id); }
}