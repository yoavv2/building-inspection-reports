# Stack

## Summary

This is an Expo / React Native mobile application for offline building-inspection reporting. The active app runtime is mostly TypeScript/TSX, but the repository also contains a parallel legacy JavaScript implementation that powers the current automated tests.

## Runtime Stack

| Concern | Current choice | Evidence |
| --- | --- | --- |
| Mobile framework | Expo `~52.0.0` on React Native `^0.76.5` | `package.json`, `app.json` |
| UI runtime | React `^18.3.1` + Expo Router `~4.0.21` | `package.json`, `app/_layout.tsx` |
| Language | TypeScript with `strict: true` | `tsconfig.json` |
| State | Zustand | `src/store/projectsStore.ts` |
| Forms | `react-hook-form` | `app/project/create.tsx`, `app/project/[id]/finding/create.tsx`, `app/settings.tsx` |
| Validation | `zod`, but only declared in one screen and not wired through a resolver | `app/project/create.tsx` |
| Local persistence | `expo-sqlite` with handwritten SQL repositories | `src/db/sqliteClient.ts`, `src/db/repositories/*.ts` |
| Export | `docx` library, local filesystem write, native share sheet | `src/features/export/exportService.ts`, `src/features/export/docxBuilder.ts` |
| Media | `expo-image-picker` + `expo-file-system` | `app/project/[id]/finding/[findingId].tsx` |
| Localization | Hebrew-first static copy, RTL layout | `src/lib/i18n/he.ts`, `app/_layout.tsx` |
| Test runner | Node built-in `node:test` | `package.json`, `test/repositories.test.js` |

## Supporting Libraries

| Library | Role |
| --- | --- |
| `expo-sharing` | Share exported DOCX files from device storage |
| `@expo/vector-icons` | Available for UI, though current screens mostly use emoji/text icons |
| `@react-native-async-storage/async-storage` | Installed but not referenced in `app/` or `src/` |
| `expo-font` | Declared as a plugin but no custom font loading code is present |

## Tooling State

- Package manager: npm, represented by `package-lock.json`
- Type checking: `./node_modules/.bin/tsc --noEmit` currently fails
- Tests: two verified entry points pass
- Linting: a `lint` script exists in `package.json`, but the manifest is currently in a conflicted state

## Codebase Shape

- `36` `.ts` files under `app/` and `src/`
- `20` `.tsx` files under `app/` and `src/`
- `27` `.js` files under `app/`, `src/`, and `test/`
- `1` `.mjs` test file

## Notable Observations

- The repository is not a pure TypeScript app. It contains two overlapping stacks:
  - A React Native / Expo runtime backed by SQLite and TS repositories
  - A legacy Node/in-memory JS stack used by tests and some export abstractions
- `package.json` and `package-lock.json` still contain merge-conflict markers, so the dependency/tooling layer is not in a clean state.
