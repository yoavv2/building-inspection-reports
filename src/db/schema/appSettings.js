const appSettingsTable = {
  name: 'app_settings',
  columns: [
    'id TEXT PRIMARY KEY',
    'key TEXT NOT NULL UNIQUE',
    'value TEXT NOT NULL',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toAppSetting(row) {
  if (!row) return null;
  return {
    id: row.id,
    key: row.key,
    value: row.value,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { appSettingsTable, toAppSetting };
