# PROJECT STATUS

Last verified: 2026-04-21

## Product Identity

`toxinmap.com` — a U.S.-first environmental intelligence globe.

Single-product surface: full-screen 3D globe for investigation of industrial
contamination, PFAS, wastewater discharge, hazardous sites, legal pressure, and
derived environmental risk regions. Users zoom from national to local to click
concrete, source-backed markers.

## Current Runtime State

**App**: Next.js 16 (Turbopack), React 19, TypeScript, Zustand, Tailwind CSS v4, Framer Motion
**Renderer**: Three.js r184 WebGL 3D globe (custom GLSL shaders for entity points)
**Database**: PostgreSQL schema defined in `db/schema.sql` — DB not populated, not running locally
**Data mode**: Mock TypeScript files (`src/data/mock/entities.ts`, 43 entities across 10 layers)
**ETL**: Python scaffolds exist in `etl/scripts/` — not yet run against real sources
**API routes**: `/api/entities` (GeoJSON) + `/api/health` — both functional, mock-backed
**Build**: Clean — 15/15 routes, 0 TypeScript errors, 0 lint errors
**QA**: 105/105 checks passing (offline validators + live API)
**Branch**: `claude/downstream-phase-1-setup-mzjxr` (5 commits, push pending — repo doesn't exist on GitHub yet)

## Phase Completion

- [x] Phase 1 — Architecture, design system, UI shell
- [x] Phase 2 — Visual polish, motion, editorial UX
- [x] Phase 3 — Explorer wiring, mock entities, ETL scaffolding
- [x] Phase 4 — Three.js globe, API routes, camera bands, atlas selection
- [x] Phase 5 — Validation harness, local runtime scripts, hero globe, cleanup

## Feature Matrix

| Feature | Status | Notes |
|---|---|---|
| Three.js 3D globe | ✅ Done | `three-globe.tsx` — sphere + texture + GLSL point shader |
| Entity rendering | ✅ Done | Color-coded by group, hover/click, raycaster |
| Camera band system | ✅ Done | national / regional / local, distance-derived |
| Atlas selection | ✅ Done | `selectNationalAtlas()`, per-layer target caps |
| Entity priority scoring | ✅ Done | Evidence + layer base + metadata bonuses |
| Detail drawer | ✅ Done | All 9 layer types rendered, sources, tags, evidence |
| Layer control panel | ✅ Done | Group toggles, per-layer toggles, entity counts |
| Search control | ✅ Done | Fuzzy search across entities + case studies, keyboard nav |
| Timeline | ✅ Done | Histogram, milestones, range slider, year buttons |
| Legend | ✅ Done | Camera band pill, active layers, evidence levels |
| Landing hero globe | ✅ Done | `hero-globe.tsx` — rotating earth behind headline |
| API: /api/entities | ✅ Done | GeoJSON, layer/group/year/bbox/limit filters |
| API: /api/health | ✅ Done | Entity counts, data mode, DB status |
| Atlas cache | ✅ Done | Pre-computed national atlas with validation summary |
| Query params | ✅ Done | Type-safe URL builder with band defaults |
| QA harness | ✅ Done | 6 validators + smoke runner, 105 checks passing |
| Local runtime | ✅ Done | up / down / status / verify scripts |
| Keyboard shortcuts | ✅ Done | E = legend, / = search |
| 404 page | ✅ Done | Branded "unmapped territory" |
| Social metadata | ✅ Done | OpenGraph + Twitter cards |
| DB population | ❌ Blocked | Needs PostgreSQL running + ETL execution |
| Real data ingestion | ❌ Blocked | Depends on DB |
| Air-toxics layer | ❌ Not started | No mock entities for this layer yet |

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

## Pages (all routes 200 OK)

- `/` — editorial landing page with 3D hero globe
- `/explore` — Three.js WebGL globe with layer controls, search, timeline, detail drawer, legend
- `/case-studies` — 6 investigation case studies
- `/case-studies/[slug]` — individual case study with methodology notes
- `/methodology` — evidence framework documentation
- `/sources` — 15-source data registry
- `/about` — mission page

## Layer Registry

10 layers across 5 groups:
- **official**: `industrial_sites`, `toxic_releases`, `power_plants`, `hazardous_sites`
- **emerging**: `pfas_sites`, `wastewater`
- **wildlife**: `sentinel_species`
- **reproductive**: `reproductive_regions`
- **regulatory**: `case_study_markers`, `legal_actions`

## Dependencies (Production)

Three.js, React 19, Next.js 16, Zustand, Framer Motion, Lucide React, CVA, clsx, tailwind-merge, next-themes

## Remaining Work (Not Blocked by This Session)

1. **Create GitHub repo** `christianortel/Toxins-dashboard` to unblock push
2. **Run ETL pipeline** once PostgreSQL is available
3. **Add air-toxics mock entities** if that layer slot is desired
4. **Remove drizzle-orm/drizzle-kit** devDependencies if DB work is deferred long-term
