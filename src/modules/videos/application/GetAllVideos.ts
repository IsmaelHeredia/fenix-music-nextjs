import { VideoRepository } from '@/modules/videos/domain/VideoRepository';

export class GetAllVideos {
  constructor(private repo: VideoRepository) {}

  execute() {
    return this.repo.findAll();
  }
}