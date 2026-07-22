import { StationRepository } from '@/modules/stations/domain/StationRepository';

export class GetAllStations {
  constructor(private repo: StationRepository) { }
  async execute() { return await this.repo.findAll(); }
}