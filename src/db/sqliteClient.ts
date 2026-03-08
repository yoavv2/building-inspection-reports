/**
 * SQLite client — wraps expo-sqlite and provides a simple async query interface.
 * All repositories use this client; no screen touches SQL directly.
 */
import * as SQLite from 'expo-sqlite';
import { ALL_TABLES } from './schema/sqliteSchema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('inspection_reports.db');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync('PRAGMA journal_mode = WAL;');
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDb();
  for (const sql of ALL_TABLES) {
    await database.execAsync(sql);
  }
}

export async function runMigrations(
  migrations: Array<{ version: number; up: (db: SQLite.SQLiteDatabase) => Promise<void> }>
): Promise<void> {
  const database = await getDb();
  const rows = await database.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version ASC'
  );
  const applied = new Set(rows.map((r) => r.version));

  for (const migration of migrations) {
    if (!applied.has(migration.version)) {
      await migration.up(database);
      await database.runAsync(
        'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
        [migration.version, new Date().toISOString()]
      );
    }
  }
}
