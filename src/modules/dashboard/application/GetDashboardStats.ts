import { TrackRepository } from '@/modules/tracks/domain/TrackRepository';
import { PlaylistRepository } from '@/modules/playlists/domain/PlaylistRepository';
import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { songs, stations, playlists, liveStreams, videos, customPlaylists } from '@/modules/shared/db/schema';
import { sql, desc, eq } from 'drizzle-orm';

export class GetDashboardStats {
  constructor(
    private trackRepo: TrackRepository,
    private playlistRepo: PlaylistRepository
  ) {}

  execute() {
    const db = getDb();
        
    const totalSongs = db.select({ count: sql<number>`count(*)` }).from(songs).get()?.count || 0;
    const totalStations = db.select({ count: sql<number>`count(*)` }).from(stations).get()?.count || 0;
    const totalLivestreams = db.select({ count: sql<number>`count(*)` }).from(liveStreams).get()?.count || 0;
    const totalVideos = db.select({ count: sql<number>`count(*)` }).from(videos).get()?.count || 0;
    const totalCustomPlaylists = db.select({ count: sql<number>`count(*)` }).from(customPlaylists).get()?.count || 0;
        
    const topPlaylists = db
      .select({
        id: playlists.id,
        name: playlists.name,
        count: sql<number>`count(${songs.id})`,
        totalDuration: sql<number>`sum(${songs.duration})`,
        totalSize: sql<number>`sum(${songs.fileSize})`,
      })
      .from(songs)
      .innerJoin(playlists, eq(songs.playlistId, playlists.id))
      .groupBy(playlists.id, playlists.name)
      .orderBy(desc(sql`count(${songs.id})`))
      .limit(3)
      .all();

    const totalSizeResult = db
      .select({ totalSize: sql<number>`sum(${songs.fileSize})` })
      .from(songs)
      .get();
    
    const totalSizeBytes = totalSizeResult?.totalSize || 0;
    
    const formatSizeAuto = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const mb = bytes / (1024 * 1024);
      const gb = bytes / (1024 * 1024 * 1024);
      if (gb >= 1) return `${gb.toFixed(2)} GB`;
      if (mb >= 1) return `${mb.toFixed(1)} MB`;
      return `${bytes} B`;
    };

    const formatDuration = (seconds: number): string => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m`;
      return '0m';
    };

    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 GB';
      const gb = bytes / (1024 * 1024 * 1024);
      if (gb < 0.01) return '< 0.01 GB';
      return `${gb.toFixed(2)} GB`;
    };

    const recent = db
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        filename: songs.filename,
        durationString: songs.durationString,
        isFavorite: songs.isFavorite,
        waveform: songs.waveform,
        playlistId: songs.playlistId,
        playlistName: playlists.name,
      })
      .from(songs)
      .leftJoin(playlists, eq(songs.playlistId, playlists.id))
      .orderBy(desc(songs.id))
      .limit(3)
      .all();

    const colors = ['#f97316', '#3b82f6', '#10b981'];

    return {
      totalSongs,
      totalStations,
      totalLivestreams,
      totalVideos,
      totalCustomPlaylists,
      totalSize: formatSizeAuto(totalSizeBytes),
      topPlaylists: topPlaylists.map((pl, i) => ({
        name: pl.name,
        count: pl.count,
        duration: formatDuration(pl.totalDuration || 0),
        size: formatSize(pl.totalSize || 0),
        color: colors[i] || '#a1a1aa'
      })),
      recent
    };
  }
}