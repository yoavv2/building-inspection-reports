const projectsTable = {
  name: 'projects',
  columns: [
    'id TEXT PRIMARY KEY',
    'name TEXT NOT NULL',
    'client_name TEXT',
    'address TEXT',
    'status TEXT NOT NULL DEFAULT "draft"',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    clientName: row.client_name,
    address: row.address,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { projectsTable, toProject };
