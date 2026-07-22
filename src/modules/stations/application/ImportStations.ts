import { Station } from "@/modules/stations/domain/Station";
import { StationRepository } from "@/modules/stations/domain/StationRepository";

export class ImportStations {
  constructor(private repo: StationRepository) {}

  async execute(data: Omit<Station, 'id'>[]) {
    if (!Array.isArray(data)) {
      throw new Error('El archivo debe contener un array de estaciones');
    }

    const seen = new Set<string>();
    const valid: Omit<Station, 'id'>[] = [];
    let invalid = 0;
    let duplicatesInFile = 0;

    for (const raw of data) {
      const name = raw?.name?.toString().trim();
      const link = raw?.link?.toString().trim();

      if (!name || !link) {
        invalid++;
        continue;
      }

      const key = name.toLowerCase();
      if (seen.has(key)) {
        duplicatesInFile++;
        continue;
      }
      seen.add(key);

      valid.push({
        name,
        link,
        categories: raw.categories?.toString().trim() || null,
      });
    }

    const { inserted } = await this.repo.bulkInsert(valid);
    const alreadyExists = valid.length - inserted;

    return {
      imported: inserted,
      skipped: invalid + duplicatesInFile + alreadyExists,
      details: { invalid, duplicatesInFile, alreadyExists },
    };
  }
}