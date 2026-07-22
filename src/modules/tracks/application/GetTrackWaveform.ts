import { TrackRepository } from '@/modules/tracks/domain/TrackRepository';

export class GetTrackWaveform {
  constructor(private repo: TrackRepository) {}

  execute(id: number) {
    return this.repo.getWaveform(id);
  }
}