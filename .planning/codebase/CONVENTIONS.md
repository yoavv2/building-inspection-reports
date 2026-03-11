# Conventions

## Established Conventions

### Language and Copy

- Internal code is written in English.
- User-facing strings are centralized in `src/lib/i18n/he.ts`.
- The app is explicitly Hebrew-first and RTL-first.

### RTL UI

- `I18nManager.forceRTL(true)` and `allowRTL(true)` are called during app boot.
- Most text components use right alignment.
- Inputs are expected to behave as RTL fields.
- The DOCX builder marks paragraphs and runs as right-to-left.

### Naming

- Domain objects use camelCase: `clientName`, `propertyAddress`, `standardReferenceId`
- SQLite columns use snake_case: `client_name`, `property_address`, `standard_reference_id`
- Repository modules are responsible for mapping between the two
- File naming is mixed but consistent within each area:
  - Expo routes use file-based router names
  - Shared modules mostly use `camelCase.ts` / `PascalCase.tsx`

### Data Access

- SQL is intended to stay inside repositories
- Screens should work with domain objects, not raw rows
- `bootstrapDatabase()` is the entry point for table setup and seed execution

### UI Primitives

- Shared primitives live in `src/components/ui/`
- Color tokens are centralized in `src/constants/colors.ts`
- Most screens hand-roll their headers instead of using a single shared header component

## Repeated Patterns

- Form screens use `react-hook-form` controllers around `TextField`
- CRUD actions follow a simple async `try/catch` + `Alert` pattern
- Orderable entities use `orderIndex`
- Seed data is bundled locally and inserted only when target tables are empty

## Conventions That Are Only Partially Enforced

- TypeScript strict mode is enabled, but the repo does not currently type-check cleanly
- `zod` schemas are defined, but validation is not consistently enforced through a resolver
- Store usage is inconsistent:
  - Some screens rely on `useProjectsStore`
  - Others call repositories directly
- Shared navigation/header patterns are inconsistent across screens

## Convention Drift

- Two parallel code styles exist:
  - Modern TS repository/domain mapping for the mobile app
  - Older CommonJS classes and in-memory records for tests
- Temporary singleton state is used for pickers (`selectedStandard`, `_templateListener`) instead of a durable state channel
- `ScreenHeader` and `typography.ts` suggest a shared design system direction, but most screens do not consume them
