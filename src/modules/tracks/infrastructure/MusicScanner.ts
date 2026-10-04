import fs from 'fs/promises';
import path from 'path';
import * as mm from 'music-metadata';
import type { TrackRepository } from '@/modules/tracks/domain/TrackRepository';
import type { Track } from '@/modules/tracks/domain/Track';
import type { PlaylistRepository } from '@/modules/playlists/domain/PlaylistRepository';

export class MusicScanner {
  constructor(
    private trackRepo: TrackRepository,
    private playlistRepo: PlaylistRepository
  ) { }

  async scan(dirPath: string): Promise<{ added: number; skipped: number }> {
    let added = 0;
    let skipped = 0;
    const foundFilenames: string[] = [];
    const existingTracks = await this.trackRepo.findAll();

    const walk = async (currentDir: string, currentPlaylistId: number | null) => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          let playlist = this.playlistRepo.findByName(entry.name);
          if (!playlist) {
            playlist = this.playlistRepo.save({ name: entry.name });
          }
          await walk(fullPath, playlist.id);
        } else if (entry.name.toLowerCase().endsWith('.mp3')) {
          foundFilenames.push(entry.name);
          const result = await this.processFile(fullPath, entry.name, currentPlaylistId, existingTracks);
          result ? added++ : skipped++;
        }
      }
    };

    await walk(dirPath, null);

    if (this.trackRepo.deleteMissing) {
      this.trackRepo.deleteMissing(foundFilenames);
    }

    this.playlistRepo.deleteEmpty();

    return { added, skipped };
  }

  private async processFile(
    fullPath: string,
    filename: string,
    playlistId: number | null,
    existingTracks: Track[]
  ): Promise<boolean> {
    const existing = existingTracks.find(
      t => t.filename === filename && t.playlistId === playlistId
    );
    if (existing) return false;

    let metadata;
    let fileSize = 0;
    let duration = 0;

    try {
      const stats = await fs.stat(fullPath);
      fileSize = stats.size;
    } catch (e) {
      console.error(`Error al obtener stats de ${filename}:`, e instanceof Error ? e.message : e);
    }

    try {
      metadata = await (mm as any).parseFile(fullPath, { skipCovers: true });
      duration = metadata?.format?.duration || 0;
    } catch (e) {
      console.error(`Error al leer metadata de ${filename}:`, e instanceof Error ? e.message : e);
    }

    this.trackRepo.save({
      title: metadata?.common?.title || path.basename(filename, '.mp3'),
      artist: metadata?.common?.artist || 'Unknown Artist',
      durationString: this.formatDuration(duration),
      duration: duration,
      fileSize: fileSize,
      filename,
      playlistId,
      isFavorite: false,
      waveform: null,
    });

    return true;
  }

  private formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}