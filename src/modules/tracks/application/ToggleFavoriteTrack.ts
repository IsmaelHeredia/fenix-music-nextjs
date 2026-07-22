import type { TrackRepository } from '@/modules/tracks/domain/TrackRepository';

export class TrackNotFoundError extends Error {
  constructor(id: number) {
    super(`No se encontró la canción con ID: ${id}`);
    this.name = 'TrackNotFoundError';
  }
}

export class ToggleFavoriteTrack {
  constructor(private repository: TrackRepository) {}

  execute(id: number) {
    const updatedTrack = this.repository.toggleFavorite(id);
    if (!updatedTrack) {
      throw new TrackNotFoundError(id);
    }
    return updatedTrack;
  }
}