import { LiveStreamRepository } from '@/modules/livestreams/domain/LiveStreamRepository';
export class GetAllLiveStreams {
  constructor(private repo: LiveStreamRepository) {}
  async execute() { return await this.repo.findAll(); }
}