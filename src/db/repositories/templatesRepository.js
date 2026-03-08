const { BaseRepository, now } = require('./baseRepository');
const { toFindingTemplate } = require('../schema/findingTemplates');

class TemplatesRepository extends BaseRepository {
  constructor(db) {
    super(db, 'finding_templates');
  }

  create(template) {
    const row = this.createRow({
      title: template.title,
      description: template.description,
      severity: template.severity,
      default_standard_code: template.defaultStandardCode ?? null,
      language: template.language ?? 'he'
    });
    return toFindingTemplate(this.db.insert(this.tableName, row));
  }

  list(language = null) {
    return this.db
      .list(
        this.tableName,
        (row) => (language ? row.language === language : true),
        (a, b) => a.title.localeCompare(b.title)
      )
      .map(toFindingTemplate);
  }

  update(id, patch) {
    const row = this.db.update(this.tableName, id, {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.severity !== undefined ? { severity: patch.severity } : {}),
      ...(patch.defaultStandardCode !== undefined ? { default_standard_code: patch.defaultStandardCode } : {}),
      ...(patch.language !== undefined ? { language: patch.language } : {}),
      updated_at: now()
    });
    return toFindingTemplate(row);
  }
}

module.exports = { TemplatesRepository };
