import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { customPlaylists, customPlaylistItems, songs } from '@/modules/shared/db/schema';
import { eq, asc } from 'drizzle-orm';
import { CustomPlaylistRepository } from '@/modules/custom-playlists/domain/CustomPlaylistRepository';
import { CustomPlaylist } from '@/modules/custom-playlists/domain/CustomPlaylist';
import { CustomPlaylistItem } from '@/modules/custom-playlists/domain/CustomPlaylistItem';

export class SqliteCustomPlaylistRepository implements CustomPlaylistRepository {

    async save(name: string, items: { songId: number; order: number }[], id?: number): Promise<number> {
        const db = getDb();

        return db.transaction((tx) => {
            let playlistId: number = id ?? 0;

            if (id) {
                tx.update(customPlaylists)
                    .set({ name })
                    .where(eq(customPlaylists.id, id))
                    .run();

                tx.delete(customPlaylistItems)
                    .where(eq(customPlaylistItems.playlistId, id))
                    .run();
            } else {
                const result = tx.insert(customPlaylists).values({ name }).run();
                playlistId = Number(result.lastInsertRowid);
            }

            if (items.length > 0) {
                tx.insert(customPlaylistItems).values(
                    items.map(item => ({
                        playlistId,
                        songId: item.songId,
                        order: item.order,
                    }))
                ).run();
            }

            return playlistId;
        });
    }

    async findAll(): Promise<CustomPlaylist[]> {
        return await getDb().select().from(customPlaylists).all();
    }

    async findById(
        id: number
    ): Promise<{ playlist: CustomPlaylist; items: (CustomPlaylistItem & { durationString: string | null })[] } | null> {
        const db = getDb();

        const playlist = await db
            .select()
            .from(customPlaylists)
            .where(eq(customPlaylists.id, id))
            .get();

        if (!playlist) return null;

        const itemsWithDetails = await db
            .select({
                songId: customPlaylistItems.songId,
                order: customPlaylistItems.order,
                durationString: songs.durationString,
            })
            .from(customPlaylistItems)
            .leftJoin(songs, eq(customPlaylistItems.songId, songs.id))
            .where(eq(customPlaylistItems.playlistId, id))
            .orderBy(asc(customPlaylistItems.order))
            .all();

        return { playlist, items: itemsWithDetails };
    }

    async delete(id: number): Promise<void> {
        await getDb()
            .delete(customPlaylists)
            .where(eq(customPlaylists.id, id))
            .run();
    }
}