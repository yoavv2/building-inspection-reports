const { BaseRepository, now } = require('./baseRepository');
const { toArea } = require('../schema/areas');

class AreasRepository extends BaseRepository {
  constructor(db) {
    super(db, 'areas');
  }

  listByProject(projectId) {
    return this.db
      .list(this.tableName, (row) => row.project_id === projectId, (a, b) => a.order_index - b.order_index)
      .map(toArea);
  }

  create(area) {
    const nextOrder = this.listByProject(area.projectId).length;
    const row = this.createRow({
      project_id: area.projectId,
      name: area.name,
      description: area.description ?? null,
      order_index: area.orderIndex ?? nextOrder
    });
    const created = this.db.insert(this.tableName, row);
    this.reorder(area.projectId, created.id);
    return toArea(this.db.findById(this.tableName, created.id));
  }

  update(id, patch) {
    const row = this.db.findById(this.tableName, id);
    if (!row) return null;
    const updated = this.db.update(this.tableName, id, {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.orderIndex !== undefined ? { order_index: patch.orderIndex } : {}),
      updated_at: now()
    });
    this.reorder(row.project_id, patch.orderIndex !== undefined ? id : null);
    return toArea(updated);
  }

  delete(id) {
    const row = this.db.findById(this.tableName, id);
    if (!row) return false;
    const ok = this.db.delete(this.tableName, id);
    this.reorder(row.project_id);
    return ok;
  }

  reorder(projectId, priorityId = null) {
    const rows = this.db.list(this.tableName, (row) => row.project_id === projectId, (a, b) => {
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

module.exports = { AreasRepository };
