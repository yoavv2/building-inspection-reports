const { InMemoryDatabase } = require('./adapters/inMemoryDatabase');
const { applyMigrations } = require('./migrations');
const {
  ProjectsRepository,
  AreasRepository,
  FindingsRepository,
  FindingImagesRepository,
  StandardsRepository,
  TemplatesRepository,
  SettingsRepository
} = require('./repositories');
const { runSeeds } = require('./seeds');

function initializeDatabase({ db = new InMemoryDatabase(), withSeeds = true } = {}) {
  applyMigrations(db);

  const repositories = {
    projectsRepository: new ProjectsRepository(db),
    areasRepository: new AreasRepository(db),
    findingsRepository: new FindingsRepository(db),
    findingImagesRepository: new FindingImagesRepository(db),
    standardsRepository: new StandardsRepository(db),
    templatesRepository: new TemplatesRepository(db),
    settingsRepository: new SettingsRepository(db)
  };

  if (withSeeds) {
    runSeeds(repositories);
  }

  return { db, repositories };
}

module.exports = { initializeDatabase };
