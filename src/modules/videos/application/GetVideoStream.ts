import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { settings } from '@/modules/shared/db/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';
import { VideoRepository } from '@/modules/videos/domain/VideoRepository';

export class GetVideoStream {
  constructor(private repo: VideoRepository) {}

  execute(id: number) {
    const video = this.repo.findById(id);
    const videoDirRow = getDb().select().from(settings).where(eq(settings.key, 'video_directory')).get();

    if (!video || !videoDirRow?.value) throw new Error('NOT_FOUND');

    const absolutePath = path.join(videoDirRow.value, video.filename);
    if (!fs.existsSync(absolutePath)) throw new Error('FILE_MISSING');

    return { absolutePath, stats: fs.statSync(absolutePath) };
  }
}