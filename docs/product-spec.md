# Product Spec — Building Inspection Reports App

## Objective

A mobile-first, offline-first inspection report application for building engineers.

The app allows the inspector to:
- Create a new inspection project
- Record structured findings on-site
- Attach photos to each finding
- Insert relevant standards/regulations references
- Write conclusions and estimated repair costs
- Export the final report as a Word document (.docx)
- Work without network connectivity
- Use a Hebrew UI and produce Hebrew report output

## Core User

A building engineer or home inspection professional writing structured defect reports on-site.

## Critical Constraints

- **Offline-first**: All core actions work with no internet
- **Hebrew-first**: All UI labels, buttons, forms, and messages in Hebrew
- **RTL**: All layouts are RTL throughout
- **No auth**: Single-user, local data only in MVP

## MVP Scope

### Must Have
- Create and edit inspection projects
- Add findings to a project
- Group findings by area / room
- Attach one or more photos per finding
- Add standards/regulations quote to each finding
- Add professional conclusion
- Add estimated repair cost
- Save everything locally (SQLite)
- View report preview in-app
- Export to .docx
- Hebrew UI
- RTL support
- Offline operation

### Out of MVP Scope
- AI writing assistance
- User accounts / auth
- Cloud sync
- Multi-user collaboration
- PDF export
- Analytics

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo |
| Language | TypeScript (strict) |
| Local DB | SQLite (expo-sqlite) |
| Navigation | Expo Router |
| State | Zustand |
| Forms | React Hook Form |
| Validation | Zod |
| Export | docx npm library |
| Images | expo-image-picker + expo-file-system |
| Sharing | expo-sharing |

## Screen List

1. **Projects List** — Home screen
2. **Create/Edit Project** — Project form
3. **Project Dashboard** — Summary + quick actions
4. **Area Management** — CRUD areas with presets
5. **Findings List** — Grouped by area
6. **Finding Editor (Create)** — New finding form
7. **Finding Editor (Edit)** — Edit + image management
8. **Standards Picker** — Browse and search standards
9. **Template Picker** — Browse reusable templates
10. **Report Preview** — Full assembled report view
11. **Settings** — Company name, defaults
