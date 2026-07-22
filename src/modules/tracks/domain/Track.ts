export interface Track {
  id: number;
  title: string;
  artist: string | null;
  playlistId: number | null;
  playlistName?: string | null;
  filename: string;
  durationString: string | null;
  duration?: number;
  fileSize?: number;
  isFavorite: boolean | null;
  waveform: string | null;
}