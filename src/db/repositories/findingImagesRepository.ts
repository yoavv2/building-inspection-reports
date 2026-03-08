import { FindingImage } from '../../types/domain';
import { generateId, getDb, now } from './base';

interface FindingImageRow {
  id: string;
  finding_id: string;
  local_uri: string;
  caption: string;
  order_index: number;
  created_at: string;
}

function rowToImage(row: FindingImageRow): FindingImage {
  return {
    id: row.id,
    findingId: row.finding_id,
    localUri: row.local_uri,
    caption: row.caption,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}

export type CreateImageInput = {
  findingId: string;
  localUri: string;
  caption?: string;
};

export const findingImagesRepository = {
  async create(input: CreateImageInput): Promise<FindingImage> {
    const db = await getDb();
    const id = generateId();
    const ts = now();
    const maxRow = await db.getFirstAsync<{ max_order: number | null }>(
      'SELECT MAX(order_index) as max_order FROM finding_images WHERE finding_id = ?',
      [input.findingId]
    );
    const orderIndex = (maxRow?.max_order ?? -1) + 1;
    await db.runAsync(
      `INSERT INTO finding_images (id, finding_id, local_uri, caption, order_index, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, input.findingId, input.localUri, input.caption ?? '', orderIndex, ts]
    );
    return (await this.getById(id))!;
  },

  async getById(id: string): Promise<FindingImage | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<FindingImageRow>(
      'SELECT * FROM finding_images WHERE id = ?',
      [id]
    );
    return row ? rowToImage(row) : null;
  },

  async listByFinding(findingId: string): Promise<FindingImage[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<FindingImageRow>(
      'SELECT * FROM finding_images WHERE finding_id = ? ORDER BY order_index ASC',
      [findingId]
    );
    return rows.map(rowToImage);
  },

  async updateCaption(id: string, caption: string): Promise<FindingImage> {
    const db = await getDb();
    await db.runAsync('UPDATE finding_images SET caption = ? WHERE id = ?', [caption, id]);
    return (await this.getById(id))!;
  },

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM finding_images WHERE id = ?', [id]);
  },

  async reorder(findingId: string, orderedIds: string[]): Promise<void> {
    const db = await getDb();
    for (let i = 0; i < orderedIds.length; i++) {
      await db.runAsync(
        'UPDATE finding_images SET order_index = ? WHERE id = ? AND finding_id = ?',
        [i, orderedIds[i], findingId]
      );
    }
  },
};
