const standardReferencesTable = {
  name: 'standard_references',
  columns: [
    'id TEXT PRIMARY KEY',
    'code TEXT NOT NULL UNIQUE',
    'title TEXT NOT NULL',
    'description TEXT',
    'language TEXT NOT NULL DEFAULT "he"',
    'category TEXT',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toStandardReference(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    language: row.language,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { standardReferencesTable, toStandardReference };
