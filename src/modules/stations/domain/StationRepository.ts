import { Station } from '@/modules/stations/domain/Station';

export interface StationRepository {
  findAll(): Promise<Station[]>;
  save(station: Omit<Station, 'id'>): Promise<Station>;
  update(station: Station): Promise<Station>;
  delete(id: number): Promise<boolean>;
  bulkInsert(stations: Omit<Station, 'id'>[]): Promise<{ inserted: number }>;
  deleteMany(ids: number[]): Promise<void>;
}