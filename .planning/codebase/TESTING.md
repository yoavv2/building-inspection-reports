# Testing

## Verified Commands

| Command | Scope | Result |
| --- | --- | --- |
| `node --test test/repositories.test.js` | Legacy in-memory repository CRUD and seeds | Passes |
| `node --test src/features/export/__tests__/docxSmoke.test.mjs` | Export fixture smoke test with Hebrew text and image path preservation | Passes |
| `./node_modules/.bin/tsc --noEmit` | TypeScript compile health | Passes |

## Current Test Strategy

- The repository uses the built-in Node test runner, not Jest/Vitest/Playwright.
- Tests are concentrated around the legacy JavaScript database layer.
- The export smoke test validates a JSON stub builder, not the actual React Native DOCX builder used by the app.

## What Is Covered

- CRUD behavior for projects, areas, findings, and images in the in-memory JS repositories
- Stable ordering / reorder behavior in the JS repositories
- Seed loading for standards, templates, and area presets in the JS path
- A basic fixture asserting Hebrew strings, mixed Hebrew+number text, and image references survive export-view-model serialization

## What Is Not Covered

- Expo Router screens
- Zustand store behavior
- The TypeScript SQLite repositories
- `bootstrapDatabase()` and Expo SQLite initialization
- Real mobile image picking and filesystem interactions
- Actual DOCX generation through `src/features/export/docxBuilder.ts`
- Report preview rendering in the active route tree
- Settings integration beyond basic repository writes

## Current Type-Check Status

The previously verified `tsc` blockers from phase `01-01` are now resolved:

- `TextField.tsx` now applies RTL direction through styles compatible with the installed React Native typings
- `docxBuilder.ts` now advertises the `Uint8Array` contract it actually returns
- Legacy export compatibility modules can import `AssembledProjectReport` through the report assembler TS entrypoint again

## Confidence Assessment

- Confidence is reasonable for the legacy JS repository behavior because that path is tested.
- Confidence is still low for the active mobile runtime because the TypeScript app path is only lightly verified even though it now type-checks.
