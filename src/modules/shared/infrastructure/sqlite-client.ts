import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/modules/shared/db/schema';
import path from 'path';
import fs from 'fs';

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'fenix.db');

let _db: DrizzleDb | null = null;
let _sqlite: Database.Database | null = null;

export function getDb(): DrizzleDb {
  if (_db) return _db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const sqlite = new Database(DB_PATH);

  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('temp_store = MEMORY');

  _sqlite = sqlite;

  _db = drizzle(sqlite, {
    schema
  });

  return _db;
}

export function closeDb(): void {
  if (_sqlite) {
    _sqlite.close();
    _sqlite = null;
    _db = null;
  }
}