const { BaseRepository, now } = require('./baseRepository');
const { toProject } = require('../schema/projects');

class ProjectsRepository extends BaseRepository {
  constructor(db) {
    super(db, 'projects');
  }

  create(project) {
    const row = this.createRow({
      name: project.name,
      client_name: project.clientName ?? null,
      address: project.address ?? null,
      status: project.status ?? 'draft'
    });
    return toProject(this.db.insert(this.tableName, row));
  }

  getById(id) {
    return toProject(this.db.findById(this.tableName, id));
  }

  list() {
    return this.db.list(this.tableName, () => true, (a, b) => a.created_at.localeCompare(b.created_at)).map(toProject);
  }

  update(id, patch) {
    const row = this.db.update(this.tableName, id, {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.clientName !== undefined ? { client_name: patch.clientName } : {}),
      ...(patch.address !== undefined ? { address: patch.address } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      updated_at: now()
    });
    return toProject(row);
  }

  delete(id) {
    return this.db.delete(this.tableName, id);
  }
}

module.exports = { ProjectsRepository };
