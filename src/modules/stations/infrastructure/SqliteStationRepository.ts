import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { stations } from '@/modules/shared/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { StationRepository } from '@/modules/stations/domain/StationRepository';
import { Station } from '@/modules/stations/domain/Station';

export class SqliteStationRepository implements StationRepository {

  async findAll(): Promise<Station[]> {
    return await getDb().select().from(stations).all();
  }

  async save(station: Omit<Station, 'id'>): Promise<Station> {
    const result = await getDb()
      .insert(stations)
      .values(station)
      .returning()
      .get();

    if (!result) throw new Error("Error al guardar la estación");
    return result;
  }

  async update(station: Station): Promise<Station> {
    const result = await getDb()
      .update(stations)
      .set({
        name: station.name,
        link: station.link,
        categories: station.categories,
      })
      .where(eq(stations.id, station.id))
      .returning()
      .get();

    if (!result) throw new Error("No se encontró la estación para actualizar");
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const res = await getDb()
      .delete(stations)
      .where(eq(stations.id, id))
      .returning()
      .all();

    return res.length > 0;
  }

  async bulkInsert(data: Omit<Station, 'id'>[]): Promise<{ inserted: number }> {
    if (data.length === 0) return { inserted: 0 };

    const result = await getDb()
      .insert(stations)
      .values(data)
      .onConflictDoNothing({ target: stations.name })
      .returning()
      .all();

    return { inserted: result.length };
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await getDb()
      .delete(stations)
      .where(inArray(stations.id, ids))
      .run();
  }

}