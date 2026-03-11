# Concerns

## Critical

### 1. Existing-project navigation is likely broken on the dashboard route

- `app/index.tsx` pushes `/project/${project.id}` without setting `selectedProject`
- `app/project/[id]/index.tsx` reads `selectedProject` and does not fetch the project by ID
- `selectProject` is imported there but never used
- Impact:
  - opening an existing project from the home list can land on a “project not found” state unless the project was just created in the same session

## High

### 2. Tests validate the legacy JS stack, not the active Expo runtime

- `test/repositories.test.js` imports `src/db/initDatabase.js`
- The mobile app uses `src/db/initDatabase.ts` + Expo SQLite repositories instead
- Data models diverge across the two paths
- Impact:
  - passing tests do not mean the shipped app path is correct

### 3. Template and standards picker integrations are incomplete

- The standards picker has no verified entrypoint from the active finding forms
- The template picker exposes a callback registration API, but no screen subscribes to it
- Impact:
  - seeded content exists but key UX paths for applying it are incomplete

### 4. Export code is still split across incompatible abstractions

- Canonical mobile export path: `exportService.ts` + `docxBuilder.ts`
- Legacy compatibility path: `index.ts`, `types.ts`, `adapters/*`, `src/screens/ReportPreviewScreen.tsx`
- Impact:
  - two export models still coexist, so maintenance cost remains higher than necessary

## Medium

### 5. Migration support exists but is not part of app boot

- `runMigrations()` exists in `src/db/sqliteClient.ts`
- `bootstrapDatabase()` only calls `initDatabase()` + seeds
- Impact:
  - schema evolution is not operationalized for real app upgrades

### 6. Store/repository boundaries are inconsistent

- Some flows use `useProjectsStore`
- Others call repositories directly from screens
- Impact:
  - duplicated orchestration logic
  - state consistency bugs are more likely

### 7. Settings are only partially connected to the rest of the app

- `companyName` and `reportTitle` feed preview/export
- `defaultInspectorName`, `defaultCurrency`, and `logoUri` are stored but not meaningfully reused
- Impact:
  - settings UX is ahead of actual behavior

### 8. Performance will degrade with report size

- `assembleReport()` performs per-finding image lookups and optional standard lookups
- `app/project/[id]/findings.tsx` also loads image counts in a loop
- Impact:
  - this is an N+1 access pattern that will become noticeable on large inspections

## Overall Risk

The product direction is clear and the offline-first core is implemented. The dependency layer is clean and the TypeScript/mobile path now compiles, but the biggest remaining risk is still the gap between the tested legacy model and the lightly verified active mobile runtime.
