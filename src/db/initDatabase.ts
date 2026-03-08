import { initDatabase as initTables } from './sqliteClient';
import { runSeeds } from './seeds/index';

export async function bootstrapDatabase(): Promise<void> {
  await initTables();
  await runSeeds();
}
