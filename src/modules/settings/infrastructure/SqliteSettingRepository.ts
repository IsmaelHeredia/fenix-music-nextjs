import { getDb } from '@/modules/shared/infrastructure/sqlite-client';
import { settings } from '@/modules/shared/db/schema';
import { eq } from 'drizzle-orm';
import { SettingRepository } from '@/modules/settings/domain/SettingRepository';

export class SqliteSettingRepository implements SettingRepository {
  get(key: string) {
    return getDb().select().from(settings).where(eq(settings.key, key)).get()?.value || null;
  }

  save(key: string, value: string) {
    getDb().insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } })
      .run();
  }
}