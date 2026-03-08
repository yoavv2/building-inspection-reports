const { randomUUID } = require('crypto');

function now() {
  return new Date().toISOString();
}

class BaseRepository {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  createRow(data) {
    const timestamp = now();
    return {
      id: data.id ?? randomUUID(),
      ...data,
      created_at: data.created_at ?? timestamp,
      updated_at: timestamp
    };
  }
}

module.exports = { BaseRepository, now };
