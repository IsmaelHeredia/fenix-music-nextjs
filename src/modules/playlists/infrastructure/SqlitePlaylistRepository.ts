import { eq, sql, notInArray, isNotNull } from 'drizzle-orm';
import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { songs, playlists } from '@/modules/shared/db/schema';
import type { PlaylistRepository } from '@/modules/playlists/domain/PlaylistRepository';
import type { Playlist } from '@/modules/playlists/domain/Playlist';

export class SqlitePlaylistRepository implements PlaylistRepository {
  findAll() {
    const db = getDb();

    const allPlaylists = db.select()
      .from(playlists)
      .orderBy(sql`LOWER(${playlists.name}) ASC`)
      .all();

    const allSongs = db.select().from(songs).all();

    return allPlaylists.map(playlist => {
      const playlistSongs = allSongs.filter(s => s.playlistId === playlist.id);

      return {
        id: playlist.id,
        name: playlist.name,
        totalTracks: playlistSongs.length,
        artistSample: playlistSongs[0]?.artist || 'Varios Artistas',
        tracks: playlistSongs
      };
    });
  }

  findById(id: number): Playlist | null {
    const row = getDb().select().from(playlists).where(eq(playlists.id, id)).get();
    return row || null;
  }

  findByName(name: string): Playlist | null {
    const row = getDb().select().from(playlists).where(eq(playlists.name, name)).get();
    return row || null;
  }

  save(playlist: Omit<Playlist, 'id'>): Playlist {
    return getDb().insert(playlists).values(playlist).returning().get();
  }

  delete(id: number): boolean {
    const result = getDb().delete(playlists).where(eq(playlists.id, id)).returning({ id: playlists.id }).all();
    return result.length > 0;
  }

  deleteEmpty(): number {
    const db = getDb();

    const usedPlaylistIds = db
      .select({ id: songs.playlistId })
      .from(songs)
      .where(isNotNull(songs.playlistId));

    const result = db
      .delete(playlists)
      .where(notInArray(playlists.id, usedPlaylistIds))
      .returning({ id: playlists.id })
      .all();

    return result.length;
  }

  deleteMissing(foundFilenames: string[]): void {
    getDb().delete(songs)
      .where(notInArray(songs.filename, foundFilenames))
      .run();
  }
}