import { AppSettings } from '../../types/domain';
import { getDb, now } from './base';

interface SettingsRow {
  id: string;
  report_title: string;
  default_inspector_name: string;
  default_currency: string;
  logo_uri: string;
  company_name: string;
  updated_at: string;
}

function rowToSettings(row: SettingsRow): AppSettings {
  return {
    id: row.id,
    reportTitle: row.report_title,
    defaultInspectorName: row.default_inspector_name,
    defaultCurrency: row.default_currency,
    logoUri: row.logo_uri,
    companyName: row.company_name,
    updatedAt: row.updated_at,
  };
}

const SINGLETON_ID = 'singleton';

export type UpdateSettingsInput = Partial<Omit<AppSettings, 'id' | 'updatedAt'>>;

export const settingsRepository = {
  async get(): Promise<AppSettings | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<SettingsRow>(
      'SELECT * FROM app_settings WHERE id = ?',
      [SINGLETON_ID]
    );
    return row ? rowToSettings(row) : null;
  },

  async upsert(input: UpdateSettingsInput): Promise<AppSettings> {
    const db = await getDb();
    const ts = now();
    const existing = await this.get();
    if (!existing) {
      await db.runAsync(
        `INSERT INTO app_settings (id, report_title, default_inspector_name, default_currency, logo_uri, company_name, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          SINGLETON_ID,
          input.reportTitle ?? 'דוח בדיקת בניין',
          input.defaultInspectorName ?? '',
          input.defaultCurrency ?? 'ILS',
          input.logoUri ?? '',
          input.companyName ?? '',
          ts,
        ]
      );
    } else {
      const sets: string[] = ['updated_at = ?'];
      const values: (string | number | null)[] = [ts];
      if (input.reportTitle !== undefined) { sets.push('report_title = ?'); values.push(input.reportTitle); }
      if (input.defaultInspectorName !== undefined) { sets.push('default_inspector_name = ?'); values.push(input.defaultInspectorName); }
      if (input.defaultCurrency !== undefined) { sets.push('default_currency = ?'); values.push(input.defaultCurrency); }
      if (input.logoUri !== undefined) { sets.push('logo_uri = ?'); values.push(input.logoUri); }
      if (input.companyName !== undefined) { sets.push('company_name = ?'); values.push(input.companyName); }
      values.push(SINGLETON_ID);
      await db.runAsync(`UPDATE app_settings SET ${sets.join(', ')} WHERE id = ?`, values);
    }
    return (await this.get())!;
  },
};
