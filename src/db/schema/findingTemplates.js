const findingTemplatesTable = {
  name: 'finding_templates',
  columns: [
    'id TEXT PRIMARY KEY',
    'title TEXT NOT NULL',
    'description TEXT NOT NULL',
    'severity TEXT NOT NULL',
    'default_standard_code TEXT',
    'language TEXT NOT NULL DEFAULT "he"',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toFindingTemplate(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    defaultStandardCode: row.default_standard_code,
    language: row.language,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { findingTemplatesTable, toFindingTemplate };
