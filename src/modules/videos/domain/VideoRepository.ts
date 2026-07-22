import { Video } from '@/modules/videos/domain/Video';

export interface VideoRepository {
  findAll(): Video[];
  findById(id: number): Video | null;
  save(video: Omit<Video, 'id'>): void;
  deleteMissing(foundFilenames: string[]): void;
}