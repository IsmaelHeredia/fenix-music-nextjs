import { StationRepository } from '@/modules/stations/domain/StationRepository';
import { ValidateStations } from '@/modules/stations/application/ValidateStations';

export class DeleteBrokenStations {
  constructor(private repository: StationRepository) {}

  async execute(): Promise<number> {
    const validator = new ValidateStations(this.repository);
    const brokenStations = await validator.execute();
    
    if (brokenStations.length > 0) {
      const ids = brokenStations.map(s => s.id);
      await this.repository.deleteMany(ids);
    }

    return brokenStations.length;
  }
}