const { migration: initialSchemaMigration } = require('./001_initial_schema');

const migrations = [initialSchemaMigration];

function getAppliedVersions(db) {
  db.createTable('schema_migrations');
  return db.list('schema_migrations').map((row) => row.version);
}

function applyMigrations(db) {
  const appliedVersions = new Set(getAppliedVersions(db));

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    migration.up(db);
    db.insert('schema_migrations', {
      id: `migration-${migration.version}`,
      version: migration.version,
      name: migration.name,
      applied_at: new Date().toISOString()
    });
  }
}

module.exports = { migrations, applyMigrations };
