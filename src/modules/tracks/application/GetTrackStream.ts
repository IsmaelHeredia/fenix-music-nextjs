import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { songs, playlists, settings } from '@/modules/shared/db/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';

export class GetTrackStream {
  execute(trackId: number) {
    const db = getDb();
    
    const trackData = db
      .select({
        filename: songs.filename,
        playlistName: playlists.name,
        waveform: songs.waveform,
      })
      .from(songs)
      .leftJoin(playlists, eq(songs.playlistId, playlists.id))
      .where(eq(songs.id, trackId))
      .get();

    const musicDirRow = db.select().from(settings).where(eq(settings.key, 'music_directory')).get();

    if (!trackData || !musicDirRow?.value) throw new Error('NOT_FOUND');

    const absolutePath = trackData.playlistName
      ? path.join(musicDirRow.value, trackData.playlistName, trackData.filename)
      : path.join(musicDirRow.value, trackData.filename);

    if (!fs.existsSync(absolutePath)) throw new Error('FILE_MISSING');

    return { absolutePath, waveform: trackData.waveform };
  }
}