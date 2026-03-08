/**
 * SQLite table definitions.
 * Each CREATE TABLE statement represents the canonical schema.
 */

export const CREATE_PROJECTS_TABLE = `
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    property_address TEXT NOT NULL,
    inspection_date TEXT NOT NULL,
    inspector_name TEXT NOT NULL,
    property_type TEXT NOT NULL DEFAULT 'apartment',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const CREATE_AREAS_TABLE = `
  CREATE TABLE IF NOT EXISTS areas (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );
`;

export const CREATE_FINDINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS findings (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    area_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    severity TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open',
    standard_reference_id TEXT,
    standard_quote_text TEXT NOT NULL DEFAULT '',
    conclusion TEXT NOT NULL DEFAULT '',
    repair_cost_estimate REAL,
    repair_cost_currency TEXT NOT NULL DEFAULT 'ILS',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
  );
`;

export const CREATE_FINDING_IMAGES_TABLE = `
  CREATE TABLE IF NOT EXISTS finding_images (
    id TEXT PRIMARY KEY,
    finding_id TEXT NOT NULL,
    local_uri TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (finding_id) REFERENCES findings(id) ON DELETE CASCADE
  );
`;

export const CREATE_STANDARD_REFERENCES_TABLE = `
  CREATE TABLE IF NOT EXISTS standard_references (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    quote_text TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'general',
    source TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    language TEXT NOT NULL DEFAULT 'he',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const CREATE_FINDING_TEMPLATES_TABLE = `
  CREATE TABLE IF NOT EXISTS finding_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    default_description TEXT NOT NULL DEFAULT '',
    default_standard_quote TEXT NOT NULL DEFAULT '',
    default_conclusion TEXT NOT NULL DEFAULT '',
    default_repair_cost_range TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    language TEXT NOT NULL DEFAULT 'he',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const CREATE_APP_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS app_settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    report_title TEXT NOT NULL DEFAULT 'דוח בדיקת בניין',
    default_inspector_name TEXT NOT NULL DEFAULT '',
    default_currency TEXT NOT NULL DEFAULT 'ILS',
    logo_uri TEXT NOT NULL DEFAULT '',
    company_name TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
  );
`;

export const CREATE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );
`;

export const ALL_TABLES = [
  CREATE_MIGRATIONS_TABLE,
  CREATE_PROJECTS_TABLE,
  CREATE_AREAS_TABLE,
  CREATE_FINDINGS_TABLE,
  CREATE_FINDING_IMAGES_TABLE,
  CREATE_STANDARD_REFERENCES_TABLE,
  CREATE_FINDING_TEMPLATES_TABLE,
  CREATE_APP_SETTINGS_TABLE,
];
