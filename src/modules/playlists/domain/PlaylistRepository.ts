import { Playlist } from '@/modules/playlists/domain/Playlist';

export interface PlaylistRepository {
  findAll(): Playlist[];
  findById(id: number): Playlist | null;
  findByName(name: string): Playlist | null;
  save(playlist: Omit<Playlist, 'id'>): Playlist;
  delete(id: number): boolean;
  deleteEmpty(): number;
}