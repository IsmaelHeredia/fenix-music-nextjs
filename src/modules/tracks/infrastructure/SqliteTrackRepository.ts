import { eq, isNull, asc, sql, notInArray } from 'drizzle-orm';
import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { songs, playlists } from '@/modules/shared/db/schema';

import type { TrackRepository, TrackInput } from '@/modules/tracks/domain/TrackRepository';
import type { Track } from '@/modules/tracks/domain/Track';

function toTrack(row: any): Track {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? 'Unknown Artist',
    durationString: row.durationString ?? null,
    duration: row.duration ?? 0,
    fileSize: row.fileSize ?? 0,
    filename: row.filename,
    playlistId: row.playlistId ?? null,
    playlistName: row.playlistName ?? null,
    isFavorite: row.isFavorite ?? false,
    waveform: row.waveform ?? null,
  };
}

export class SqliteTrackRepository implements TrackRepository {
  findAll(): Track[] {
    return getDb()
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        playlistId: songs.playlistId,
        playlistName: playlists.name,
        filename: songs.filename,
        durationString: songs.durationString,
        duration: songs.duration,
        fileSize: songs.fileSize,
        isFavorite: songs.isFavorite,
        waveform: songs.waveform
      })
      .from(songs)
      .leftJoin(playlists, eq(songs.playlistId, playlists.id))
      .all()
      .map(toTrack);
  }

  findFavorites(): Track[] {
    return getDb()
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        playlistId: songs.playlistId,
        playlistName: playlists.name,
        filename: songs.filename,
        durationString: songs.durationString,
        isFavorite: songs.isFavorite,
        waveform: songs.waveform
      })
      .from(songs)
      .leftJoin(playlists, eq(songs.playlistId, playlists.id))
      .where(eq(songs.isFavorite, true))
      .all()
      .map(toTrack);
  }

  findById(id: number): Track | null {
    const row = getDb()
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        playlistId: songs.playlistId,
        playlistName: playlists.name,
        filename: songs.filename,
        durationString: songs.durationString,
        isFavorite: songs.isFavorite,
        waveform: songs.waveform
      })
      .from(songs)
      .leftJoin(playlists, eq(songs.playlistId, playlists.id))
      .where(eq(songs.id, id))
      .get();

    return row ? toTrack(row) : null;
  }

  findByPlaylist(playlistId: number): Track[] {
    return getDb()
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        playlistId: songs.playlistId,
        playlistName: playlists.name,
        filename: songs.filename,
        durationString: songs.durationString,
        isFavorite: songs.isFavorite,
        waveform: songs.waveform
      })
      .from(songs)
      .leftJoin(playlists, eq(songs.playlistId, playlists.id))
      .where(eq(songs.playlistId, playlistId))
      .all()
      .map(toTrack);
  }

  findUnassigned(): Track[] {
    return getDb()
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        playlistId: songs.playlistId,
        playlistName: sql`NULL`,
        filename: songs.filename,
        durationString: songs.durationString,
        isFavorite: songs.isFavorite,
        waveform: songs.waveform
      })
      .from(songs)
      .where(isNull(songs.playlistId))
      .all()
      .map(toTrack);
  }

  save(track: TrackInput): Track {
    const inserted = getDb().insert(songs).values({
      title: track.title,
      artist: track.artist,
      durationString: track.durationString,
      duration: track.duration,
      fileSize: track.fileSize,
      filename: track.filename,
      playlistId: track.playlistId,
      isFavorite: track.isFavorite,
    }).returning().get();

    return toTrack(inserted);
  }

  toggleFavorite(id: number): Track | null {
    const db = getDb();
    const existing = db.select().from(songs).where(eq(songs.id, id)).get();
    if (!existing) return null;

    const updated = db.update(songs)
      .set({ isFavorite: !existing.isFavorite })
      .where(eq(songs.id, id))
      .returning()
      .get();

    return updated ? toTrack(updated) : null;
  }

  delete(id: number): boolean {
    const result = getDb().delete(songs).where(eq(songs.id, id)).returning({ id: songs.id }).all();
    return result.length > 0;
  }

  deleteMissing(foundFilenames: string[]): void {
    getDb().delete(songs)
      .where(notInArray(songs.filename, foundFilenames))
      .run();
  }

  count(): number {
    const result = getDb()
      .select({ count: sql<number>`count(*)` })
      .from(songs)
      .get();

    return result ? result.count : 0;
  }

  getWaveform(id: number): string | null {
    const row = getDb()
      .select({ waveform: songs.waveform })
      .from(songs)
      .where(eq(songs.id, id))
      .get();

    return row?.waveform || null;
  }
}