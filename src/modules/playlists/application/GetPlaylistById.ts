import { PlaylistRepository } from '@/modules/playlists/domain/PlaylistRepository';
import { TrackRepository } from '@/modules/tracks/domain/TrackRepository';

export class PlaylistNotFoundError extends Error { }

export class GetPlaylistById {
  constructor(
    private playlistRepo: PlaylistRepository,
    private trackRepo: TrackRepository
  ) { }

  execute(id: number) {
    const playlist = this.playlistRepo.findById(id);
    if (!playlist) throw new PlaylistNotFoundError();

    const tracks = this.trackRepo.findByPlaylist(id);

    return {
      name: playlist.name,
      tracks: tracks
    };
  }
}