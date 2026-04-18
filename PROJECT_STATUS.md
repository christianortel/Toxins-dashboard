# PROJECT STATUS

Last verified: 2026-04-18

## Product Identity

`toxinmap.com` — a U.S.-first environmental intelligence globe.

Single-product surface: full-screen 3D globe for investigation of industrial
contamination, PFAS, wastewater discharge, hazardous sites, legal pressure, and
derived environmental risk regions. Users zoom from national to local to click
concrete, source-backed markers.

## Current Runtime State

**App**: Next.js 16 (Turbopack), TypeScript, Zustand, Tailwind CSS v4
**Renderer**: MapLibre GL JS (2D map) — **Three.js globe not yet implemented**
**Database**: PostgreSQL schema defined in `db/schema.sql` — **DB not populated, not running locally**
**Data mode**: Mock TypeScript files (`src/data/mock/entities.ts`, 43 entities)
**ETL**: Python scaffolds exist in `etl/scripts/` — **not yet run against real sources**
**Build**: Passes clean — `npm run build` 15/15 routes, 0 TypeScript errors, 0 lint errors
**Branch**: `claude/downstream-phase-1-setup-mzjxr`

## Phase Completion

- [x] Phase 1 — Architecture, design system, UI shell
- [x] Phase 2 — Visual polish, motion, editorial UX
- [x] Phase 3 — Explorer wiring, mock entities, ETL scaffolding
- [ ] Phase 4 — Three.js globe, real API routes, DB population
- [ ] Phase 5 — Atlas contracts, camera bands, validation harness

## Gap to Target Product

The target product (`toxinmap.com` master spec) requires:

| Requirement | Current State | Target |
|---|---|---|
| Renderer | MapLibre GL (2D) | Three.js 3D globe |
| Data source | 43 mock TypeScript entities | 383,940 DB-backed entities |
| API routes | None | `/api/entities`, `/api/health`, atlas endpoints |
| DB | Not running | PostgreSQL + PostGIS, populated |
| ETL | Scaffolded, unrun | Live fetchers for TRI, PFAS, NPDES, etc. |
| Camera bands | None | `national` / `regional` / `local` |
| Atlas contracts | None | Opening atlas with quality gates |
| Validation | None | Full QA harness (`qa:validate-*` scripts) |
| Continuity docs | None | `PROJECT_STATUS.md`, `TODO_BACKLOG.md`, `DECISIONS.md` |

## Current Entity Counts (Mock)

- `industrial_sites`: 6
- `power_plants`: 4
- `pfas_sites`: 6
- `hazardous_sites`: 4
- `wastewater`: 4
- `sentinel_species`: 7
- `reproductive_regions`: 4
- `case_study_markers`: 4
- `legal_actions`: 4
- **Total**: 43

## Pages

- `/` — editorial landing page
- `/explore` — MapLibre GL explorer with layer controls, search, timeline, detail drawer
- `/case-studies` — 6 investigation case studies
- `/methodology` — evidence framework documentation
- `/sources` — 15-source data registry
- `/about` — mission page

## Layer Registry (Current)

10 layers across 5 groups:
- official: `industrial_sites`, `toxic_releases`, `power_plants`, `hazardous_sites`
- emerging: `pfas_sites`, `wastewater`
- wildlife: `sentinel_species`
- reproductive: `reproductive_regions`
- regulatory: `case_study_markers`, `legal_actions`
