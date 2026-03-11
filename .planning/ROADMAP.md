# Roadmap: Building Inspection Reports

**Updated:** 2026-03-11
**Status:** Bootstrap reconstruction from existing phase files

## Overview

This roadmap was reconstructed from the existing phase-01 plan files and the current codebase snapshot because the repository did not contain a prior `.planning/ROADMAP.md`. It currently captures only the known runtime-alignment phase and should be expanded once later phases are planned explicitly.

## Phases

- [ ] **Phase 1: Runtime Alignment** - Clean the Expo/TypeScript runtime path, then repair the broken authoring and navigation flows that block normal mobile use.

## Phase Details

### Phase 1: Runtime Alignment
**Goal**: Stabilize the canonical Expo mobile runtime so the repository is buildable again and the primary authoring flows can be completed without relying on fragile in-memory state.
**Depends on**: Nothing (bootstrap phase)
**Requirements**: Bootstrap reconstruction; no formal requirement IDs were present in the existing plan files
**Success Criteria** (what must be TRUE):
  1. Dependency manifests are valid and `./node_modules/.bin/tsc --noEmit` passes.
  2. Existing projects reopen correctly from route params alone.
  3. Template and standards selection are wired into the active finding flow.
  4. Stored defaults are consumed where the app already intends to use them.
  5. Existing regression commands still pass, with new coverage added where practical.
**Plans**: 2 plans

Plans:
- [x] 01-01: Clean manifests, restore TypeScript compile health, and make the mobile export path canonical
- [ ] 01-02: Repair reopen-project, picker wiring, and settings default flows with regression coverage

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Runtime Alignment | 1/2 | In progress | - |

## Notes

- Bootstrapped on 2026-03-11 from `.planning/phases/01-runtime-alignment/*.md` and `.planning/codebase/*.md`.
- `.planning/PROJECT.md` and `.planning/config.json` are still absent; current planning state is derived from the checked-in phase documents.
