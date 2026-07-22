export type Tab = 'my-lists' | 'library' | 'editor';

export interface EnrichedPlaylist {
  id: number;
  name: string;
  songCount: number;
  totalDuration: string;
  items: EnrichedItem[];
}

export interface EnrichedItem {
  songId: number;
  order?: number;
  title: string;
  playlistName: string;
  durationString: string | null;
}

export interface SelectedIds {
  songs: number[];
  playlists: number[];
}

export interface DeleteTarget {
  id: number;
  name: string;
}