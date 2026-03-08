import { seedStandards } from './standardsSeeds';
import { seedTemplates } from './templatesSeeds';
import { getDb } from '../sqliteClient';

export async function runSeeds(): Promise<void> {
  // Only seed if tables are empty
  const db = await getDb();
  const standardCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM standard_references'
  );
  if ((standardCount?.count ?? 0) === 0) {
    await seedStandards();
  }

  const templateCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM finding_templates'
  );
  if ((templateCount?.count ?? 0) === 0) {
    await seedTemplates();
  }
}
