const { hebrewStandards } = require('./hebrewStandards');
const { defaultFindingTemplates } = require('./findingTemplates');
const { areaPresets } = require('./areaPresets');

function seedStandards(standardsRepository) {
  return hebrewStandards.map((standard) => standardsRepository.upsertByCode(standard));
}

function seedTemplates(templatesRepository) {
  return defaultFindingTemplates.map((template) => templatesRepository.create(template));
}

function seedAreaPresets(settingsRepository) {
  return settingsRepository.set('areaPresets', areaPresets);
}

function runSeeds(repositories) {
  seedStandards(repositories.standardsRepository);
  seedTemplates(repositories.templatesRepository);
  seedAreaPresets(repositories.settingsRepository);
}

module.exports = {
  hebrewStandards,
  defaultFindingTemplates,
  areaPresets,
  seedStandards,
  seedTemplates,
  seedAreaPresets,
  runSeeds
};
