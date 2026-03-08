const { BaseRepository, now } = require('./baseRepository');
const { toFinding } = require('../schema/findings');

class FindingsRepository extends BaseRepository {
  constructor(db) {
    super(db, 'findings');
  }

  listByArea(areaId) {
    return this.db
      .list(this.tableName, (row) => row.area_id === areaId, (a, b) => a.order_index - b.order_index)
      .map(toFinding);
  }

  create(finding) {
    const nextOrder = this.listByArea(finding.areaId).length;
    const row = this.createRow({
      project_id: finding.projectId,
      area_id: finding.areaId,
      title: finding.title,
      description: finding.description ?? null,
      severity: finding.severity ?? 'medium',
      status: finding.status ?? 'open',
      order_index: finding.orderIndex ?? nextOrder
    });

    const created = this.db.insert(this.tableName, row);
    this.reorder(finding.areaId, created.id);
    return toFinding(this.db.findById(this.tableName, created.id));
  }

  update(id, patch) {
    const row = this.db.findById(this.tableName, id);
    if (!row) return null;

    const updated = this.db.update(this.tableName, id, {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.severity !== undefined ? { severity: patch.severity } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.orderIndex !== undefined ? { order_index: patch.orderIndex } : {}),
      updated_at: now()
    });
    this.reorder(row.area_id, patch.orderIndex !== undefined ? id : null);
    return toFinding(updated);
  }

  delete(id) {
    const row = this.db.findById(this.tableName, id);
    if (!row) return false;
    const ok = this.db.delete(this.tableName, id);
    this.reorder(row.area_id);
    return ok;
  }

  reorder(areaId, priorityId = null) {
    const rows = this.db.list(this.tableName, (row) => row.area_id === areaId, (a, b) => {
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

module.exports = { FindingsRepository };
