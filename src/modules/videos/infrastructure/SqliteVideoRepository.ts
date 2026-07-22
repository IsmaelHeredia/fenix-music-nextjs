import { eq, notInArray } from 'drizzle-orm';
import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { videos } from '@/modules/shared/db/schema';
import { VideoRepository } from '@/modules/videos/domain/VideoRepository';
import { Video } from '@/modules/videos/domain/Video';

export class SqliteVideoRepository implements VideoRepository {
  findAll() {
    return getDb().select().from(videos).all();
  }

  findById(id: number) {
    const video = getDb().select().from(videos).where(eq(videos.id, id)).get();
    return video || null;
  }

  save(video: Omit<Video, 'id'>) {
    return getDb().insert(videos).values(video).run();
  }

  deleteMissing(foundFilenames: string[]): void {
    if (foundFilenames.length === 0) {
      getDb().delete(videos).run();
      return;
    }

    getDb()
      .delete(videos)
      .where(notInArray(videos.filename, foundFilenames))
      .run();
  }

}