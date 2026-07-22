import { StationRepository } from '@/modules/stations/domain/StationRepository';
import { StreamUrlValidator } from '@/modules/shared/domain/StreamUrlValidator';
import { Station } from '@/modules/stations/domain/Station';

export class ValidateStations {
  constructor(private repository: StationRepository) { }

  async execute(): Promise<Station[]> {
    const allStations = await this.repository.findAll();
    const brokenStations: Station[] = [];

    for (const station of allStations) {
      try {
        await StreamUrlValidator.validate(station.link);
      } catch {
        brokenStations.push(station);
      }
    }

    return brokenStations;
  }
}