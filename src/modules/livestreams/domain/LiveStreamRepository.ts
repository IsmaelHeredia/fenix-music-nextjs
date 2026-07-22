import { LiveStream } from '@/modules/livestreams/domain/LiveStream';

export interface LiveStreamRepository {
  findAll(): Promise<LiveStream[]>;
  save(livestream: Omit<LiveStream, 'id'>): Promise<LiveStream>;
  update(livestream: LiveStream): Promise<LiveStream>;
  delete(id: number): Promise<boolean>;
  bulkInsert(livestreams: Omit<LiveStream, 'id'>[]): Promise<void>;
}