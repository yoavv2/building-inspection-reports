import { Finding, Severity, FindingStatus } from '../../types/domain';
import { generateId, getDb, now } from './base';

interface FindingRow {
  id: string;
  project_id: string;
  area_id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  standard_reference_id: string | null;
  standard_quote_text: string;
  conclusion: string;
  repair_cost_estimate: number | null;
  repair_cost_currency: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

function rowToFinding(row: FindingRow): Finding {
  return {
    id: row.id,
    projectId: row.project_id,
    areaId: row.area_id,
    title: row.title,
    description: row.description,
    severity: row.severity as Severity,
    status: row.status as FindingStatus,
    standardReferenceId: row.standard_reference_id,
    standardQuoteText: row.standard_quote_text,
    conclusion: row.conclusion,
    repairCostEstimate: row.repair_cost_estimate,
    repairCostCurrency: row.repair_cost_currency,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CreateFindingInput = {
  projectId: string;
  areaId: string;
  title: string;
  description?: string;
  severity?: Severity;
  standardReferenceId?: string | null;
  standardQuoteText?: string;
  conclusion?: string;
  repairCostEstimate?: number | null;
  repairCostCurrency?: string;
};

export type UpdateFindingInput = Partial<
  Omit<Finding, 'id' | 'projectId' | 'areaId' | 'createdAt' | 'updatedAt'>
>;

export const findingsRepository = {
  async create(input: CreateFindingInput): Promise<Finding> {
    const db = await getDb();
    const id = generateId();
    const ts = now();
    const maxRow = await db.getFirstAsync<{ max_order: number | null }>(
      'SELECT MAX(order_index) as max_order FROM findings WHERE area_id = ?',
      [input.areaId]
    );
    const orderIndex = (maxRow?.max_order ?? -1) + 1;

    await db.runAsync(
      `INSERT INTO findings
        (id, project_id, area_id, title, description, severity, status,
         standard_reference_id, standard_quote_text, conclusion,
         repair_cost_estimate, repair_cost_currency, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.projectId,
        input.areaId,
        input.title,
        input.description ?? '',
        input.severity ?? 'medium',
        'open',
        input.standardReferenceId ?? null,
        input.standardQuoteText ?? '',
        input.conclusion ?? '',
        input.repairCostEstimate ?? null,
        input.repairCostCurrency ?? 'ILS',
        orderIndex,
        ts,
        ts,
      ]
    );
    return (await this.getById(id))!;
  },

  async getById(id: string): Promise<Finding | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<FindingRow>('SELECT * FROM findings WHERE id = ?', [id]);
    return row ? rowToFinding(row) : null;
  },

  async listByArea(areaId: string): Promise<Finding[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FindingRow>(
      'SELECT * FROM findings WHERE area_id = ? ORDER BY order_index ASC',
      [areaId]
    );
    return rows.map(rowToFinding);
  },

  async listByProject(projectId: string): Promise<Finding[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FindingRow>(
      'SELECT * FROM findings WHERE project_id = ? ORDER BY order_index ASC',
      [projectId]
    );
    return rows.map(rowToFinding);
  },

  async update(id: string, input: UpdateFindingInput): Promise<Finding> {
    const db = await getDb();
    const ts = now();
    const sets: string[] = ['updated_at = ?'];
    const values: (string | number | null)[] = [ts];

    if (input.title !== undefined) { sets.push('title = ?'); values.push(input.title); }
    if (input.description !== undefined) { sets.push('description = ?'); values.push(input.description); }
    if (input.severity !== undefined) { sets.push('severity = ?'); values.push(input.severity); }
    if (input.status !== undefined) { sets.push('status = ?'); values.push(input.status); }
    if (input.standardReferenceId !== undefined) { sets.push('standard_reference_id = ?'); values.push(input.standardReferenceId); }
    if (input.standardQuoteText !== undefined) { sets.push('standard_quote_text = ?'); values.push(input.standardQuoteText); }
    if (input.conclusion !== undefined) { sets.push('conclusion = ?'); values.push(input.conclusion); }
    if (input.repairCostEstimate !== undefined) { sets.push('repair_cost_estimate = ?'); values.push(input.repairCostEstimate); }
    if (input.repairCostCurrency !== undefined) { sets.push('repair_cost_currency = ?'); values.push(input.repairCostCurrency); }
    if (input.orderIndex !== undefined) { sets.push('order_index = ?'); values.push(input.orderIndex); }

    values.push(id);
    await db.runAsync(`UPDATE findings SET ${sets.join(', ')} WHERE id = ?`, values);
    return (await this.getById(id))!;
  },

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM findings WHERE id = ?', [id]);
  },
};
