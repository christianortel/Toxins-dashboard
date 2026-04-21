# TODO BACKLOG

Last updated: 2026-04-21

---

## Remaining Work

### [BLOCKED] Push to GitHub

The repository `christianortel/Toxins-dashboard` does not exist on GitHub.
Create it at https://github.com/new (empty, no README), then run:

```bash
git push -u origin claude/downstream-phase-1-setup-mzjxr
```

6 commits pending push.

### [BLOCKED] Database Population

Scripts exist in `etl/scripts/`. Requires PostgreSQL instance running + schema applied.

Priority order:
1. `fetch_tri.py` — EPA Envirofacts (industrial sites, ~21k facilities)
2. `fetch_pfas.py` — EPA UCMR 5 (PFAS detections)
3. `fetch_superfund.py` — EPA NPL sites
4. `fetch_enforcement.py` — EPA ECHO enforcement
5. `fetch_wastewater.py` — NPDES discharge monitoring
6. `fetch_power_plants.py` — EPA eGRID

### [OPTIONAL] Air-Toxics Layer

The master spec references 5 air-toxics-region entities in the opening atlas.
Currently zero mock entities exist for this layer. Adding would require:
- New `air_toxics_regions` LayerId (or repurpose existing slot)
- 5+ mock entries in `src/data/mock/entities.ts`
- Update `NATIONAL_ATLAS_TARGETS` in `camera-bands.ts`

Quality gates: `epa-echo` source required, `legal_overlap >= 50`.

### [OPTIONAL] Drizzle Cleanup

`drizzle-orm` and `drizzle-kit` are in devDependencies for future DB integration.
If DB work is deferred long-term, they can be removed.

---

## DONE — Complete Feature Log

### Phase 1 — Architecture & Design System
- [x] Next.js 16 App Router setup
- [x] Tailwind CSS v4 design tokens (accent colors, glass effect, typography)
- [x] Site header, footer, page container components
- [x] Shared UI primitives (badges, chips, accordions, states)

### Phase 2 — Visual Polish & Motion
- [x] Framer Motion animations (blurReveal, fadeInUp, fadeIn)
- [x] Editorial transitions with quote styling
- [x] Featured categories with live layer counts
- [x] Statistics section with animated counters
- [x] Methodology preview with accordion sections

### Phase 3 — Explorer Wiring & Mock Data
- [x] 43 mock entities across 10 layers with full metadata
- [x] 15 data sources with agency/authority info
- [x] 6 case studies with methodology notes
- [x] Layer control panel (group + per-layer toggles)
- [x] Search control (fuzzy, keyboard nav, 8-result cap)
- [x] Timeline shell (histogram, milestones, range slider)
- [x] Detail drawer (all 9 layer types, evidence, sources, tags)
- [x] Legend shell with evidence levels
- [x] Keyboard shortcuts (E = legend, / = search)
- [x] ETL script scaffolding (Python)

### Phase 4 — Three.js Globe & API
- [x] Three.js r184 WebGL 3D globe (`three-globe.tsx`)
- [x] Custom GLSL vertex + fragment shaders for entity points
- [x] Earth night texture with dark procedural fallback
- [x] Atmosphere glow shell (additive blending)
- [x] OrbitControls (damping, auto-rotate, min/max zoom)
- [x] Raycaster hover/click with point size change
- [x] Camera band system (`camera-bands.ts`): national / regional / local
- [x] Band-aware layer gating (`isLayerEnabledForBand()`)
- [x] Entity priority scoring (`entity-priority.ts`)
- [x] National atlas selection (`selectNationalAtlas()`)
- [x] Local entity ranking (`rankLocalEntities()`)
- [x] Click behavior config (dense vs concrete per layer)
- [x] API route: `/api/entities` (GeoJSON, layer/group/year/bbox/limit filters)
- [x] API route: `/api/health` (entity counts, data mode, DB status)
- [x] Zustand store extensions (cameraBand, cameraDistance, setCameraDistance)
- [x] Legend updated with camera band pill

### Phase 5 — Validation, Polish, Hero Globe
- [x] Atlas cache (`atlas-cache.ts`) — pre-computed national atlas
- [x] Query params builder (`query-params.ts`) — type-safe URL construction
- [x] QA validation harness (6 validators + smoke, 105 checks passing):
  - `qa:validate-home-atlas-cache` (16 checks)
  - `qa:validate-zoom-drilldown` (40 checks)
  - `qa:validate-local-focus-priority` (6 checks)
  - `qa:validate-browser-interactions` (21 checks)
  - `qa:validate-pfas-coverage-notes` (6 checks)
  - `qa:validate-live-api` (16 checks)
  - `qa:smoke` (runs all offline validators)
- [x] Local runtime scripts: `local:up`, `local:down`, `local:status`, `local:verify`
- [x] Hero globe on landing page (`hero-globe.tsx`)
- [x] Deleted unused `map-shell.tsx`
- [x] Removed dead dependencies (deck.gl ×4, maplibre-gl, react-query, d3)
- [x] Removed dead MapLibre CSS overrides
- [x] Fixed TypeScript errors in QA scripts
- [x] Added `.local/` to `.gitignore`
- [x] 404 page ("unmapped territory")
- [x] OpenGraph / Twitter social metadata
- [x] Timeline historical milestone markers
- [x] Case study methodology notes
- [x] Dead import cleanup, React 19 lint fixes
- [x] `fetch_tri.py` upgraded to shared ETL utils
- [x] Continuity docs: PROJECT_STATUS.md, DECISIONS.md, TODO_BACKLOG.md

### Verification (2026-04-21)
- [x] `npm run build` — 15/15 pages, 0 errors
- [x] `npx tsc --noEmit` — 0 errors
- [x] `npx eslint src/` — 0 warnings
- [x] `npm run qa:smoke` — 89/89 offline checks
- [x] `npm run local:verify` — 105/105 checks (offline + live API)
- [x] All routes return HTTP 200
- [x] Dev server starts and responds to health check
