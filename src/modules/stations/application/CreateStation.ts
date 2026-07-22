import { Station } from "@/modules/stations/domain/Station";
import { StationRepository } from "@/modules/stations/domain/StationRepository";

export class CreateStation {
  constructor(private repo: StationRepository) {}
  async execute(data: Omit<Station, 'id'>) { return await this.repo.save(data); }
}