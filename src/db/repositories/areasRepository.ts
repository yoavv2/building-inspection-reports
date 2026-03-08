import { Area } from '../../types/domain';
import { generateId, getDb, now } from './base';

interface AreaRow {
  id: string;
  project_id: string;
  name: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

function rowToArea(row: AreaRow): Area {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    description: row.description,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CreateAreaInput = { projectId: string; name: string; description?: string };
export type UpdateAreaInput = Partial<Pick<Area, 'name' | 'description' | 'orderIndex'>>;

export const areasRepository = {
  async create(input: CreateAreaInput): Promise<Area> {
    const db = await getDb();
    const id = generateId();
    const ts = now();
    const maxRow = await db.getFirstAsync<{ max_order: number | null }>(
      'SELECT MAX(order_index) as max_order FROM areas WHERE project_id = ?',
      [input.projectId]
    );
    const orderIndex = (maxRow?.max_order ?? -1) + 1;
    await db.runAsync(
      `INSERT INTO areas (id, project_id, name, description, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.projectId, input.name, input.description ?? '', orderIndex, ts, ts]
    );
    return (await this.getById(id))!;
  },

  async getById(id: string): Promise<Area | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<AreaRow>('SELECT * FROM areas WHERE id = ?', [id]);
    return row ? rowToArea(row) : null;
  },

  async listByProject(projectId: string): Promise<Area[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<AreaRow>(
      'SELECT * FROM areas WHERE project_id = ? ORDER BY order_index ASC',
      [projectId]
    );
    return rows.map(rowToArea);
  },

  async update(id: string, input: UpdateAreaInput): Promise<Area> {
    const db = await getDb();
    const ts = now();
    const sets: string[] = ['updated_at = ?'];
    const values: (string | number)[] = [ts];

    if (input.name !== undefined) { sets.push('name = ?'); values.push(input.name); }
    if (input.description !== undefined) { sets.push('description = ?'); values.push(input.description); }
    if (input.orderIndex !== undefined) { sets.push('order_index = ?'); values.push(input.orderIndex); }

    values.push(id);
    await db.runAsync(`UPDATE areas SET ${sets.join(', ')} WHERE id = ?`, values);
    return (await this.getById(id))!;
  },

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM areas WHERE id = ?', [id]);
  },

  async reorder(projectId: string, orderedIds: string[]): Promise<void> {
    const db = await getDb();
    for (let i = 0; i < orderedIds.length; i++) {
      await db.runAsync(
        'UPDATE areas SET order_index = ?, updated_at = ? WHERE id = ? AND project_id = ?',
        [i, now(), orderedIds[i], projectId]
      );
    }
  },
};
