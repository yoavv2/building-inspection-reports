const { projectsTable } = require('./projects');
const { areasTable } = require('./areas');
const { findingsTable } = require('./findings');
const { findingImagesTable } = require('./findingImages');
const { standardReferencesTable } = require('./standardReferences');
const { findingTemplatesTable } = require('./findingTemplates');
const { appSettingsTable } = require('./appSettings');

const schemaTables = [
  projectsTable,
  areasTable,
  findingsTable,
  findingImagesTable,
  standardReferencesTable,
  findingTemplatesTable,
  appSettingsTable
];

module.exports = { schemaTables };
