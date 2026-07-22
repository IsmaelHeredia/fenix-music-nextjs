import { CustomPlaylist } from "./CustomPlaylist";
import { CustomPlaylistItem } from "./CustomPlaylistItem";

export interface CustomPlaylistRepository {
  save(name: string, items: { songId: number; order: number }[]): Promise<number>;
  findAll(): Promise<CustomPlaylist[]>;
  findById(id: number): Promise<{ playlist: CustomPlaylist; items: any[] } | null>;
  delete(id: number): Promise<void>;
}