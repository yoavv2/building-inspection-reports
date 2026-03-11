# Integrations

## External Services

There are no network APIs, cloud backends, or third-party SaaS integrations in the current MVP. The app is designed to work fully offline on a single device.

## Platform and Library Integrations

| Integration | Purpose | Key files | Current state |
| --- | --- | --- | --- |
| `expo-sqlite` | Persistent local storage for projects, areas, findings, templates, standards, settings | `src/db/sqliteClient.ts`, `src/db/schema/sqliteSchema.ts`, `src/db/repositories/*.ts` | Active |
| `expo-image-picker` | Capture or choose finding images | `app/project/[id]/finding/[findingId].tsx` | Active |
| `expo-file-system` | Store copied images and exported DOCX files locally | `app/project/[id]/finding/[findingId].tsx`, `src/features/export/exportService.ts`, `src/features/export/docxBuilder.ts` | Active |
| `expo-sharing` | Open native share sheet for the exported DOCX | `src/features/export/exportService.ts` | Active |
| `docx` | Build Word document output on-device | `src/features/export/docxBuilder.ts` | Active, but lightly verified |
| Expo Router | Navigation and route state | `app/_layout.tsx`, all files in `app/` | Active |
| `react-hook-form` | Manage screen forms | project/finding/settings screens | Active |
| `zod` | Local form schema definition | `app/project/create.tsx` | Partial |

## Bundled Data Integrations

| Source | Purpose | Key files |
| --- | --- | --- |
| Hebrew standards seed | Offline standards/regulations library | `src/db/seeds/standardsSeeds.ts` |
| Finding templates seed | Reusable Hebrew finding templates | `src/db/seeds/templatesSeeds.ts` |
| Hebrew copy catalog | Centralized UI strings | `src/lib/i18n/he.ts` |

## Internal Integration Points

### Report assembly

- `assembleReport(projectId)` joins:
  - project
  - areas
  - findings
  - finding images
  - optional standard reference
  - settings

### Export

- `exportReport(projectId)` depends on:
  - report assembly
  - DOCX building
  - filesystem write
  - optional native sharing support

### Picker state handoff

- `app/template-picker.tsx` exposes a module-level `_templateListener`
- `src/lib/utils/selectedStandard.ts` exposes module-level setter/listener functions
- These are ad hoc cross-screen integrations rather than durable navigation/store state

## Partial or Missing Integrations

- The standards picker route exists, but there is no verified in-app route push into it from the active finding screens.
- The template picker is routable from create-finding, but no screen registers `onTemplateSelected`, so template selection is not currently wired back into form state.
- Settings values are only partially consumed:
  - `companyName` and `reportTitle` influence preview/export
  - `defaultInspectorName` and `defaultCurrency` are stored but not reused to prefill project/finding forms

## Compatibility Notes

- Some export-related files still assume Node APIs (`node:fs`, `node:path`) and belong to the legacy path, not the Expo runtime.
- The active mobile DOCX flow also assumes `Buffer`/`atob` availability, which should be treated as a runtime compatibility point to verify on real devices.
