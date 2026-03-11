# Structure

## Top Level

| Path | Role |
| --- | --- |
| `app/` | Expo Router routes and mobile screens |
| `src/` | Shared app code: store, DB, export, UI primitives, domain types |
| `docs/` | Product, data-model, Hebrew-copy, and report-structure notes |
| `test/` | Node tests for the legacy JS repository layer |
| `package.json` / `package-lock.json` | Dependency and script definitions |

## Route Map

| Route file | Purpose |
| --- | --- |
| `app/index.tsx` | Projects list / home screen |
| `app/project/create.tsx` | Create project form |
| `app/project/[id]/index.tsx` | Project dashboard |
| `app/project/[id]/areas.tsx` | Area management |
| `app/project/[id]/findings.tsx` | Findings list grouped by area |
| `app/project/[id]/finding/create.tsx` | Create finding form |
| `app/project/[id]/finding/[findingId].tsx` | Edit finding and manage images |
| `app/project/[id]/preview.tsx` | In-app report preview and export |
| `app/template-picker.tsx` | Finding template selection screen |
| `app/standards-picker.tsx` | Standards library picker |
| `app/settings.tsx` | App-wide settings |

## `src/` Layout

| Path | Responsibility | Notes |
| --- | --- | --- |
| `src/store/` | Zustand store | Only one store today: `projectsStore.ts` |
| `src/db/` | Persistence layer | Contains both active TS SQLite code and legacy JS in-memory code |
| `src/services/reportAssembler/` | Report hydration | New TS assembler plus legacy compatibility service |
| `src/features/export/` | Export-specific mapping and builders | Canonical mobile export lives beside legacy compatibility abstractions |
| `src/components/ui/` | Shared UI primitives | Buttons, dialogs, inputs, badges, empty state, card |
| `src/lib/i18n/` | Hebrew string catalog | Centralized user-facing copy |
| `src/lib/utils/` | Small shared utilities | Currently includes module-level standard selection state |
| `src/constants/` | Colors and typography tokens | Typography helper is currently unused |
| `src/types/` | Domain and export types | Includes both current domain types and legacy graph types |
| `src/screens/` | Legacy/web-like screen component | `ReportPreviewScreen.tsx` is not part of the Expo route tree |

## File Mix

- Active mobile UI is concentrated in `app/` and TS/TSX modules under `src/`
- Legacy compatibility code lives in parallel under `src/db/**/*.js`, `src/screens/ReportPreviewScreen.tsx`, and parts of `src/features/export/`
- Seeds and schema exist twice:
  - TypeScript SQLite schema/seeds for the mobile app
  - JavaScript schema/seeds for the in-memory test harness

## Important Seams

### Persistence split

- TS path: `src/db/sqliteClient.ts`, `src/db/schema/sqliteSchema.ts`, `src/db/repositories/*.ts`
- JS path: `src/db/initDatabase.js`, `src/db/adapters/inMemoryDatabase.js`, `src/db/repositories/*.js`

### Export split

- Canonical mobile export: `src/features/export/exportService.ts`, `src/features/export/docxBuilder.ts`
- Legacy compatibility abstraction: `src/features/export/index.ts`, `src/features/export/types.ts`, `src/features/export/adapters/*`

## Structure Assessment

- The top-level organization is readable.
- The biggest structural issue is duplication rather than discoverability: the same concepts exist in multiple incompatible forms.
