const { BaseRepository, now } = require('./baseRepository');
const { toAppSetting } = require('../schema/appSettings');

class SettingsRepository extends BaseRepository {
  constructor(db) {
    super(db, 'app_settings');
  }

  set(key, value) {
    const row = this.db.upsertByKey(this.tableName, 'key', key, (current, exists) => {
      if (exists) {
        return { value: JSON.stringify(value), updated_at: now() };
      }

      return this.createRow({ key, value: JSON.stringify(value) });
    });

    return toAppSetting(row);
  }

  get(key) {
    const row = this.db.list(this.tableName, (item) => item.key === key)[0] ?? null;
    if (!row) return null;
    const domain = toAppSetting(row);
    return {
      ...domain,
      value: JSON.parse(domain.value)
    };
  }

  list() {
    return this.db.list(this.tableName, () => true, (a, b) => a.key.localeCompare(b.key)).map((row) => {
      const domain = toAppSetting(row);
      return { ...domain, value: JSON.parse(domain.value) };
    });
  }
}

module.exports = { SettingsRepository };
