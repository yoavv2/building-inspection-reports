const { initializeDatabase } = require('./db/initDatabase');

function startApp() {
  const context = initializeDatabase({ withSeeds: true });
  return context;
}

module.exports = { startApp };
