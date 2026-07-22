import type { Track } from '@/modules/tracks/domain/Track';

export type TrackInput = Omit<Track, 'id'>;

export interface TrackRepository {
  findAll(): Track[];
  findFavorites(): Track[];
  findById(id: number): Track | null;
  findByPlaylist(id: number): Track[];
  findUnassigned(): Track[];
  save(track: TrackInput): Track;
  deleteMissing(foundFilenames: string[]): void;
  toggleFavorite(id: number): Track | null;
  delete(id: number): boolean;
  count(): number;
  getWaveform(id: number): string | null;
}