const { BaseRepository, now } = require('./baseRepository');
const { toStandardReference } = require('../schema/standardReferences');

class StandardsRepository extends BaseRepository {
  constructor(db) {
    super(db, 'standard_references');
  }

  create(standard) {
    const row = this.createRow({
      code: standard.code,
      title: standard.title,
      description: standard.description ?? null,
      language: standard.language ?? 'he',
      category: standard.category ?? null
    });
    return toStandardReference(this.db.insert(this.tableName, row));
  }

  upsertByCode(standard) {
    const row = this.db.upsertByKey(this.tableName, 'code', standard.code, (current, exists) => {
      if (exists) {
        return {
          title: standard.title,
          description: standard.description ?? null,
          language: standard.language ?? current.language,
          category: standard.category ?? null,
          updated_at: now()
        };
      }
      return this.createRow({
        code: standard.code,
        title: standard.title,
        description: standard.description ?? null,
        language: standard.language ?? 'he',
        category: standard.category ?? null
      });
    });
    return toStandardReference(row);
  }

  list() {
    return this.db.list(this.tableName, () => true, (a, b) => a.code.localeCompare(b.code)).map(toStandardReference);
  }
}

module.exports = { StandardsRepository };
