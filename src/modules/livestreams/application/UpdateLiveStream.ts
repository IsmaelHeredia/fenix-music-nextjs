import { LiveStream } from '@/modules/livestreams/domain/LiveStream';
import { LiveStreamRepository } from '@/modules/livestreams/domain/LiveStreamRepository';

export class UpdateLiveStream {
  constructor(private repo: LiveStreamRepository) {}

  async execute(livestream: LiveStream): Promise<LiveStream> {
    
    return await this.repo.update(livestream);
  }
}