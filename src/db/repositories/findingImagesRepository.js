const { BaseRepository, now } = require('./baseRepository');
const { toFindingImage } = require('../schema/findingImages');

class FindingImagesRepository extends BaseRepository {
  constructor(db) {
    super(db, 'finding_images');
  }

  listByFinding(findingId) {
    return this.db
      .list(this.tableName, (row) => row.finding_id === findingId, (a, b) => a.order_index - b.order_index)
      .map(toFindingImage);
  }

  create(image) {
    const nextOrder = this.listByFinding(image.findingId).length;
    const row = this.createRow({
      finding_id: image.findingId,
      uri: image.uri,
      caption: image.caption ?? null,
      order_index: image.orderIndex ?? nextOrder
    });
    const created = this.db.insert(this.tableName, row);
    this.reorder(image.findingId, created.id);
    return toFindingImage(this.db.findById(this.tableName, created.id));
  }

  update(id, patch) {
    const row = this.db.findById(this.tableName, id);
    if (!row) return null;
    const updated = this.db.update(this.tableName, id, {
      ...(patch.uri !== undefined ? { uri: patch.uri } : {}),
      ...(patch.caption !== undefined ? { caption: patch.caption } : {}),
      ...(patch.orderIndex !== undefined ? { order_index: patch.orderIndex } : {}),
      updated_at: now()
    });
    this.reorder(row.finding_id, patch.orderIndex !== undefined ? id : null);
    return toFindingImage(updated);
  }

  delete(id) {
    const row = this.db.findById(this.tableName, id);
    if (!row) return false;
    const ok = this.db.delete(this.tableName, id);
    this.reorder(row.finding_id);
    return ok;
  }

  reorder(findingId, priorityId = null) {
    const rows = this.db.list(this.tableName, (row) => row.finding_id === findingId, (a, b) => {
      if (a.order_index !== b.order_index) return a.order_index - b.order_index;
      if (priorityId && a.id === priorityId) return -1;
      if (priorityId && b.id === priorityId) return 1;
      return a.created_at.localeCompare(b.created_at);
    });
    rows.forEach((row, index) => {
      this.db.update(this.tableName, row.id, { order_index: index, updated_at: now() });
    });
  }
}

module.exports = { FindingImagesRepository };
