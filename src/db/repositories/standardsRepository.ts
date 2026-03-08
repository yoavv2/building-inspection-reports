import { StandardReference } from '../../types/domain';
import { generateId, getDb, now } from './base';

interface StandardRow {
  id: string;
  code: string;
  title: string;
  quote_text: string;
  category: string;
  source: string;
  tags: string;
  language: string;
  created_at: string;
  updated_at: string;
}

function rowToStandard(row: StandardRow): StandardReference {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    quoteText: row.quote_text,
    category: row.category,
    source: row.source,
    tags: JSON.parse(row.tags || '[]'),
    language: row.language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type CreateStandardInput = Omit<StandardReference, 'id' | 'createdAt' | 'updatedAt'>;

export const standardsRepository = {
  async upsert(input: CreateStandardInput): Promise<StandardReference> {
    const db = await getDb();
    const ts = now();
    const existing = await db.getFirstAsync<StandardRow>(
      'SELECT * FROM standard_references WHERE code = ?',
      [input.code]
    );
    if (existing) {
      await db.runAsync(
        `UPDATE standard_references
         SET title = ?, quote_text = ?, category = ?, source = ?, tags = ?, updated_at = ?
         WHERE code = ?`,
        [input.title, input.quoteText, input.category, input.source, JSON.stringify(input.tags), ts, input.code]
      );
      return rowToStandard((await db.getFirstAsync<StandardRow>(
        'SELECT * FROM standard_references WHERE code = ?',
        [input.code]
      ))!);
    }
    const id = generateId();
    await db.runAsync(
      `INSERT INTO standard_references (id, code, title, quote_text, category, source, tags, language, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.code, input.title, input.quoteText, input.category, input.source, JSON.stringify(input.tags), input.language, ts, ts]
    );
    return rowToStandard((await db.getFirstAsync<StandardRow>(
      'SELECT * FROM standard_references WHERE id = ?',
      [id]
    ))!);
  },

  async getById(id: string): Promise<StandardReference | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<StandardRow>(
      'SELECT * FROM standard_references WHERE id = ?',
      [id]
    );
    return row ? rowToStandard(row) : null;
  },

  async list(language = 'he'): Promise<StandardReference[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<StandardRow>(
      'SELECT * FROM standard_references WHERE language = ? ORDER BY category, code ASC',
      [language]
    );
    return rows.map(rowToStandard);
  },

  async search(query: string, language = 'he'): Promise<StandardReference[]> {
    const db = await getDb();
    const q = `%${query}%`;
    const rows = await db.getAllAsync<StandardRow>(
      `SELECT * FROM standard_references
       WHERE language = ? AND (title LIKE ? OR code LIKE ? OR quote_text LIKE ? OR tags LIKE ?)
       ORDER BY category, code ASC`,
      [language, q, q, q, q]
    );
    return rows.map(rowToStandard);
  },
};
