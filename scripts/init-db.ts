import { getDb, closeDb } from '@/modules/shared/infrastructure/sqlite-client';
import { stations, liveStreams } from '@/modules/shared/db/schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

async function run(): Promise<void> {
  console.log('▶ Inicializando Base de Datos...');
  const db = getDb();

  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('  ✓ Schema aplicado.');
  
  closeDb();
  console.log('✅ Inicialización completada.');
}

run().catch((err) => {
  console.error('❌ Error fatal durante la inicialización:', err.message);
  process.exit(1);
});