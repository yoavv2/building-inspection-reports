import { FindingTemplate } from '../../types/domain';
import { generateId, getDb, now } from './base';

interface TemplateRow {
  id: string;
  title: string;
  category: string;
  default_description: string;
  default_standard_quote: string;
  default_conclusion: string;
  default_repair_cost_range: string;
  tags: string;
  language: string;
  created_at: string;
  updated_at: string;
}

function rowToTemplate(row: TemplateRow): FindingTemplate {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    defaultDescription: row.default_description,
    defaultStandardQuote: row.default_standard_quote,
    defaultConclusion: row.default_conclusion,
    defaultRepairCostRange: row.default_repair_cost_range,
    tags: JSON.parse(row.tags || '[]'),
    language: row.language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CreateTemplateInput = Omit<FindingTemplate, 'id' | 'createdAt' | 'updatedAt'>;

export const templatesRepository = {
  async create(input: CreateTemplateInput): Promise<FindingTemplate> {
    const db = await getDb();
    const id = generateId();
    const ts = now();
    await db.runAsync(
      `INSERT INTO finding_templates
        (id, title, category, default_description, default_standard_quote, default_conclusion, default_repair_cost_range, tags, language, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.title,
        input.category,
        input.defaultDescription,
        input.defaultStandardQuote,
        input.defaultConclusion,
        input.defaultRepairCostRange,
        JSON.stringify(input.tags),
        input.language,
        ts,
        ts,
      ]
    );
    return rowToTemplate((await db.getFirstAsync<TemplateRow>(
      'SELECT * FROM finding_templates WHERE id = ?',
      [id]
    ))!);
  },

  async list(language = 'he'): Promise<FindingTemplate[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<TemplateRow>(
      'SELECT * FROM finding_templates WHERE language = ? ORDER BY category, title ASC',
      [language]
    );
    return rows.map(rowToTemplate);
  },

  async search(query: string, language = 'he'): Promise<FindingTemplate[]> {
    const db = await getDb();
    const q = `%${query}%`;
    const rows = await db.getAllAsync<TemplateRow>(
      `SELECT * FROM finding_templates
       WHERE language = ? AND (title LIKE ? OR category LIKE ? OR tags LIKE ?)
       ORDER BY category, title ASC`,
      [language, q, q, q]
    );
    return rows.map(rowToTemplate);
  },
};
