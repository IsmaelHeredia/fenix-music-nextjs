import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { liveStreams } from '@/modules/shared/db/schema';
import { eq } from 'drizzle-orm';
import { LiveStreamRepository } from '@/modules/livestreams/domain/LiveStreamRepository';
import { LiveStream } from '@/modules/livestreams/domain/LiveStream';

export class SqliteLiveStreamRepository implements LiveStreamRepository {
  
  async findAll(): Promise<LiveStream[]> {
    return await getDb().select().from(liveStreams).all();
  }

  async save(liveStream: Omit<LiveStream, 'id'>): Promise<LiveStream> {
    const result = await getDb()
      .insert(liveStreams)
      .values(liveStream)
      .returning()
      .get();
    
    if (!result) throw new Error("Error al guardar la estación");
    return result;
  }

  async update(liveStream: LiveStream): Promise<LiveStream> {
    const result = await getDb()
      .update(liveStreams)
      .set({
        name: liveStream.name,
        link: liveStream.link,
        categories: liveStream.categories,
      })
      .where(eq(liveStreams.id, liveStream.id))
      .returning()
      .get();

    if (!result) throw new Error("No se encontró la estación para actualizar");
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const res = await getDb()
      .delete(liveStreams)
      .where(eq(liveStreams.id, id))
      .returning()
      .all();
      
    return res.length > 0;
  }

  async bulkInsert(data: Omit<LiveStream, 'id'>[]): Promise<void> {
    await getDb().insert(liveStreams).values(data).run();
  }
}