const findingImagesTable = {
  name: 'finding_images',
  columns: [
    'id TEXT PRIMARY KEY',
    'finding_id TEXT NOT NULL',
    'uri TEXT NOT NULL',
    'caption TEXT',
    'order_index INTEGER NOT NULL',
    'created_at TEXT NOT NULL',
    'updated_at TEXT NOT NULL'
  ]
};

function toFindingImage(row) {
  if (!row) return null;
  return {
    id: row.id,
    findingId: row.finding_id,
    uri: row.uri,
    caption: row.caption,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { findingImagesTable, toFindingImage };
