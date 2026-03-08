const { schemaTables } = require('../schema');

const migration = {
  version: 1,
  name: 'initial_schema',
  up(db) {
    db.createTable('schema_migrations');
    for (const table of schemaTables) {
      db.createTable(table.name);
    }
  }
};

module.exports = { migration };
