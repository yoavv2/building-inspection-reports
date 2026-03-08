import { Project, ProjectStatus, PropertyType } from '../../types/domain';
import { generateId, getDb, now } from './base';

interface ProjectRow {
  id: string;
  client_name: string;
  property_address: string;
  inspection_date: string;
  inspector_name: string;
  property_type: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    clientName: row.client_name,
    propertyAddress: row.property_address,
    inspectionDate: row.inspection_date,
    inspectorName: row.inspector_name,
    propertyType: row.property_type as PropertyType,
    notes: row.notes,
    status: row.status as ProjectStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: ProjectStatus;
};

export type UpdateProjectInput = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;

export const projectsRepository = {
  async create(input: CreateProjectInput): Promise<Project> {
    const db = await getDb();
    const id = generateId();
    const ts = now();
    await db.runAsync(
      `INSERT INTO projects
        (id, client_name, property_address, inspection_date, inspector_name, property_type, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.clientName,
        input.propertyAddress,
        input.inspectionDate,
        input.inspectorName,
        input.propertyType ?? 'apartment',
        input.notes ?? '',
        input.status ?? 'draft',
        ts,
        ts,
      ]
    );
    return (await this.getById(id))!;
  },

  async getById(id: string): Promise<Project | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<ProjectRow>('SELECT * FROM projects WHERE id = ?', [id]);
    return row ? rowToProject(row) : null;
  },

  async list(): Promise<Project[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<ProjectRow>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    return rows.map(rowToProject);
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const db = await getDb();
    const ts = now();
    const sets: string[] = ['updated_at = ?'];
    const values: (string | number | null)[] = [ts];

    if (input.clientName !== undefined) { sets.push('client_name = ?'); values.push(input.clientName); }
    if (input.propertyAddress !== undefined) { sets.push('property_address = ?'); values.push(input.propertyAddress); }
    if (input.inspectionDate !== undefined) { sets.push('inspection_date = ?'); values.push(input.inspectionDate); }
    if (input.inspectorName !== undefined) { sets.push('inspector_name = ?'); values.push(input.inspectorName); }
    if (input.propertyType !== undefined) { sets.push('property_type = ?'); values.push(input.propertyType); }
    if (input.notes !== undefined) { sets.push('notes = ?'); values.push(input.notes); }
    if (input.status !== undefined) { sets.push('status = ?'); values.push(input.status); }

    values.push(id);
    await db.runAsync(`UPDATE projects SET ${sets.join(', ')} WHERE id = ?`, values);
    return (await this.getById(id))!;
  },

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM projects WHERE id = ?', [id]);
  },
};
