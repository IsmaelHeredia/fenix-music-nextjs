import { Station } from '@/modules/stations/domain/Station';
import { StationRepository } from '@/modules/stations/domain/StationRepository';

export class UpdateStation {
  constructor(private repo: StationRepository) { }

  async execute(station: Station): Promise<Station> {

    return await this.repo.update(station);
  }
}