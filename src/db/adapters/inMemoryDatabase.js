class InMemoryDatabase {
  constructor() {
    this.tables = new Map();
  }

  ensureTable(name) {
    if (!this.tables.has(name)) {
      this.tables.set(name, []);
    }
  }

  createTable(name) {
    this.ensureTable(name);
  }

  insert(table, row) {
    this.ensureTable(table);
    this.tables.get(table).push({ ...row });
    return { ...row };
  }

  list(table, predicate = () => true, sorter = null) {
    this.ensureTable(table);
    const rows = this.tables.get(table).filter(predicate).map((row) => ({ ...row }));
    if (sorter) {
      rows.sort(sorter);
    }
    return rows;
  }

  findById(table, id) {
    this.ensureTable(table);
    const row = this.tables.get(table).find((item) => item.id === id);
    return row ? { ...row } : null;
  }

  update(table, id, patch) {
    this.ensureTable(table);
    const rows = this.tables.get(table);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return null;
    rows[index] = { ...rows[index], ...patch };
    return { ...rows[index] };
  }

  delete(table, id) {
    this.ensureTable(table);
    const rows = this.tables.get(table);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return false;
    rows.splice(index, 1);
    return true;
  }

  upsertByKey(table, key, value, rowFactory) {
    this.ensureTable(table);
    const rows = this.tables.get(table);
    const existingIndex = rows.findIndex((row) => row[key] === value);
    if (existingIndex >= 0) {
      rows[existingIndex] = { ...rows[existingIndex], ...rowFactory(rows[existingIndex], true) };
      return { ...rows[existingIndex] };
    }
    const row = rowFactory(null, false);
    rows.push(row);
    return { ...row };
  }
}

module.exports = { InMemoryDatabase };
