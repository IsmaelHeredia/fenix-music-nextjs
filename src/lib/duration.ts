import { PlayableItem } from '@/context/PlaybackContext';

export function getPlaylistDurationStr(tracks: PlayableItem[] = []): string {
  const totalSecs = tracks.reduce((acc, track) => {
    if (!track.durationString) return acc;
    const parts = track.durationString.split(':').map(Number);
    if (parts.length === 3) return acc + parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return acc + parts[0] * 60 + (parts[1] || 0);
    return acc;
  }, 0);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return '0m';
}

export function parseDurationString(durationString: string | null | undefined): number {
  if (!durationString) return 0;
  const parts = durationString.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + (parts[1] || 0);
  return 0;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getDurationFromTracks(tracks: { durationString?: string | null }[] = []): string {
  return getPlaylistDurationStr(tracks as PlayableItem[]);
}