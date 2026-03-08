# Data Model — Building Inspection Reports

## Entities

### Project
One inspection job. Parent of all other entities.

| Field | Type | Notes |
|---|---|---|
| id | TEXT | UUID |
| clientName | TEXT | Required |
| propertyAddress | TEXT | Required |
| inspectionDate | TEXT | ISO date |
| inspectorName | TEXT | Required |
| propertyType | TEXT | apartment / house / office / commercial / industrial / other |
| notes | TEXT | Optional |
| status | TEXT | draft / completed / exported |
| createdAt | TEXT | ISO datetime |
| updatedAt | TEXT | ISO datetime |

### Area
Logical section of the property. A project has many areas.

| Field | Type | Notes |
|---|---|---|
| id | TEXT | UUID |
| projectId | TEXT | FK → projects |
| name | TEXT | e.g., מרפסת, סלון |
| description | TEXT | Optional |
| orderIndex | INTEGER | Stable user-defined ordering |
| createdAt | TEXT | |
| updatedAt | TEXT | |

### Finding
A single defect or issue. Belongs to one area.

| Field | Type | Notes |
|---|---|---|
| id | TEXT | UUID |
| projectId | TEXT | FK → projects |
| areaId | TEXT | FK → areas |
| title | TEXT | Required |
| description | TEXT | |
| severity | TEXT | high / medium / low |
| status | TEXT | open / closed |
| standardReferenceId | TEXT | FK → standard_references (nullable) |
| standardQuoteText | TEXT | Snapshot of quote at time of entry |
| conclusion | TEXT | Inspector recommendation |
| repairCostEstimate | REAL | Nullable |
| repairCostCurrency | TEXT | Default: ILS |
| orderIndex | INTEGER | |
| createdAt | TEXT | |
| updatedAt | TEXT | |

### FindingImage
Photo attached to a finding.

| Field | Type | Notes |
|---|---|---|
| id | TEXT | UUID |
| findingId | TEXT | FK → findings |
| localUri | TEXT | Absolute path on device |
| caption | TEXT | |
| orderIndex | INTEGER | |
| createdAt | TEXT | |

### StandardReference
Bundled library of building standards/regulations (Hebrew).

| Field | Type | Notes |
|---|---|---|
| id | TEXT | UUID |
| code | TEXT | Unique (e.g., IS-1596) |
| title | TEXT | |
| quoteText | TEXT | Default quoted text |
| category | TEXT | safety / fire / accessibility / structural / etc. |
| source | TEXT | e.g., מכון התקנים הישראלי |
| tags | TEXT | JSON array |
| language | TEXT | Default: he |

### FindingTemplate
Reusable defect entry template.

| Field | Type | Notes |
|---|---|---|
| id | TEXT | UUID |
| title | TEXT | |
| category | TEXT | |
| defaultDescription | TEXT | |
| defaultStandardQuote | TEXT | |
| defaultConclusion | TEXT | |
| defaultRepairCostRange | TEXT | e.g., "3,000–8,000 ₪" |
| tags | TEXT | JSON array |
| language | TEXT | Default: he |

### AppSettings
Singleton row with app-wide configuration.

| Field | Type | Notes |
|---|---|---|
| id | TEXT | Always "singleton" |
| reportTitle | TEXT | Default: דוח בדיקת בניין |
| defaultInspectorName | TEXT | |
| defaultCurrency | TEXT | Default: ILS |
| logoUri | TEXT | Local path to logo image |
| companyName | TEXT | |

## Hierarchy

```
Project
└── Area[]
    └── Finding[]
        └── FindingImage[]
```

## Ordering

Every collection (areas, findings, images) has an `orderIndex` integer.
Repositories assign it automatically (max + 1) on insert.
Reorder operations update indices in a loop.
