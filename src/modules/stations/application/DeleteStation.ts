import { StationRepository } from '@/modules/stations/domain/StationRepository';

export class DeleteStation {
  constructor(private repo: StationRepository) {}
  async execute(id: number) { return await this.repo.delete(id); }
}