const findingsTable = {
  name: 'findings',
  columns: [
    'id TEXT PRIMARY KEY',
    'project_id TEXT NOT NULL',
    'area_id TEXT NOT NULL',
    'title TEXT NOT NULL',
    'description TEXT',
    'severity TEXT NOT NULL',
    'status TEXT NOT NULL DEFAULT "open"',
    'order_index INTEGER NOT NULL',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toFinding(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    areaId: row.area_id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    status: row.status,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { findingsTable, toFinding };
