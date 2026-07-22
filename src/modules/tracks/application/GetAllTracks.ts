import type { TrackRepository } from '@/modules/tracks/domain/TrackRepository';
import type { Track } from '@/modules/tracks/domain/Track';

export class GetAllTracks {
  constructor(private repository: TrackRepository) {}

  execute(onlyFavorites: boolean = false): Track[] {
    return onlyFavorites ? this.repository.findFavorites() : this.repository.findAll();
  }
}