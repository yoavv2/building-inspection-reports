const areasTable = {
  name: 'areas',
  columns: [
    'id TEXT PRIMARY KEY',
    'project_id TEXT NOT NULL',
    'name TEXT NOT NULL',
    'description TEXT',
    'order_index INTEGER NOT NULL',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toArea(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    description: row.description,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { areasTable, toArea };
