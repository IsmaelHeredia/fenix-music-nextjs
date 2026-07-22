import { LiveStream } from "@/modules/livestreams/domain/LiveStream";
import { LiveStreamRepository } from "@/modules/livestreams/domain/LiveStreamRepository";

export class CreateLiveStream {
  constructor(private repo: LiveStreamRepository) {}
  async execute(data: Omit<LiveStream, 'id'>) { return await this.repo.save(data); }
}