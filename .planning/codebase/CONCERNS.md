# Concerns

## Critical

### 1. Dependency manifests are still in a merge-conflict state

- `package.json` contains `<<<<<<<`, `=======`, `>>>>>>>` markers
- `package-lock.json` contains many conflict regions
- Impact:
  - dependency management is not trustworthy
  - script execution through package tooling is fragile
  - the repository is not in a releaseable state

### 2. The TypeScript/mobile path does not compile cleanly

- Verified by `./node_modules/.bin/tsc --noEmit`
- Failures are concentrated in:
  - `src/components/ui/TextField.tsx`
  - `src/features/export/docxBuilder.ts`
  - `src/features/export/domainMapping.ts`
  - `src/features/export/types.ts`
  - `src/screens/ReportPreviewScreen.tsx`
- Impact:
  - strict typing is declared but currently not enforced
  - refactors on the active app path are unsafe

### 3. Existing-project navigation is likely broken on the dashboard route

- `app/index.tsx` pushes `/project/${project.id}` without setting `selectedProject`
- `app/project/[id]/index.tsx` reads `selectedProject` and does not fetch the project by ID
- `selectProject` is imported there but never used
- Impact:
  - opening an existing project from the home list can land on a “project not found” state unless the project was just created in the same session

## High

### 4. Tests validate the legacy JS stack, not the active Expo runtime

- `test/repositories.test.js` imports `src/db/initDatabase.js`
- The mobile app uses `src/db/initDatabase.ts` + Expo SQLite repositories instead
- Data models diverge across the two paths
- Impact:
  - passing tests do not mean the shipped app path is correct

### 5. Template and standards picker integrations are incomplete

- The standards picker has no verified entrypoint from the active finding forms
- The template picker exposes a callback registration API, but no screen subscribes to it
- Impact:
  - seeded content exists but key UX paths for applying it are incomplete

### 6. Export code is split across incompatible abstractions

- Active export path: `exportService.ts` + `docxBuilder.ts`
- Legacy export path: `index.ts`, `types.ts`, `adapters/*`, `src/screens/ReportPreviewScreen.tsx`
- The legacy TS export modules currently cause compile errors
- Impact:
  - it is unclear which export architecture should be treated as canonical

## Medium

### 7. Migration support exists but is not part of app boot

- `runMigrations()` exists in `src/db/sqliteClient.ts`
- `bootstrapDatabase()` only calls `initDatabase()` + seeds
- Impact:
  - schema evolution is not operationalized for real app upgrades

### 8. Store/repository boundaries are inconsistent

- Some flows use `useProjectsStore`
- Others call repositories directly from screens
- Impact:
  - duplicated orchestration logic
  - state consistency bugs are more likely

### 9. Settings are only partially connected to the rest of the app

- `companyName` and `reportTitle` feed preview/export
- `defaultInspectorName`, `defaultCurrency`, and `logoUri` are stored but not meaningfully reused
- Impact:
  - settings UX is ahead of actual behavior

### 10. Performance will degrade with report size

- `assembleReport()` performs per-finding image lookups and optional standard lookups
- `app/project/[id]/findings.tsx` also loads image counts in a loop
- Impact:
  - this is an N+1 access pattern that will become noticeable on large inspections

## Overall Risk

The product direction is clear and the offline-first core is implemented, but the repository is in a transitional state. The biggest risk is not missing features in isolation; it is the gap between the tested legacy model and the active mobile runtime.
