# TODO BACKLOG

Last updated: 2026-04-18

Ordered by leverage. Do not re-derive this list from scratch — reconcile with
`PROJECT_STATUS.md` and the live repo state before picking the next task.

---

## P0 — Globe Renderer (Core Product Gap)

### [TODO] Implement Three.js 3D globe

Replace the current MapLibre 2D map with a WebGL-rendered 3D sphere.

Requirements:
- Full-screen globe at `/explore` (and eventually `/`)
- U.S. centered opening view
- Dark map tile texture or natural earth projection
- Canvas-backed — no DOM marker flooding
- Entity markers rendered as WebGL points/billboards on the sphere
- Hover + click pass-through to detail drawer
- Integration with existing Zustand store

Files to create/modify:
- `src/components/explore/three-globe.tsx` — Three.js renderer
- `src/components/explore/globe-shell.tsx` — replaces `map-shell.tsx`
- `src/app/explore/page.tsx` — swap renderer

Dependencies to install:
- `three` + `@types/three`
- `@react-three/fiber` (optional, may go raw Three.js for control)

---

## P0 — API Routes (Data Serving)

### [TODO] Implement `/api/entities` route

Serve entities from DB (when available) with fallback to mock file data.

Requirements:
- GET `/api/entities?layer=&group=&bbox=&year=`
- Returns GeoJSON FeatureCollection
- DB-backed when PostgreSQL is running
- Falls back to mock entities when DB is unavailable
- Camera-band-aware: `scale` param drives selection logic

### [TODO] Implement `/api/health` route

Required by master spec verification contract.

Returns:
```json
{
  "totalEntities": N,
  "totalLayers": 9,
  "industrialSites": N,
  "pfasSites": N,
  ...
  "dataMode": "database" | "mock"
}
```

---

## P0 — Database Population

### [TODO] Run ETL pipeline against real data sources

Scripts exist in `etl/scripts/`. Need to run against real sources.

Priority order:
1. `fetch_tri.py` — EPA Envirofacts (industrial sites, ~21k facilities)
2. `fetch_pfas.py` — EPA UCMR 5 (PFAS detections)
3. `fetch_superfund.py` — EPA NPL sites
4. `fetch_enforcement.py` — EPA ECHO enforcement
5. `fetch_wastewater.py` — NPDES discharge monitoring
6. `fetch_power_plants.py` — EPA eGRID

Prerequisite: PostgreSQL instance running and schema applied.

---

## P1 — Camera Band System

### [TODO] Implement camera bands: national / regional / local

The globe uses explicit bands that gate which entities are visible.

Band definitions (from master spec):
- `national`: broadest view, quality-gated opening atlas (~49 entities)
- `regional`: mid-zoom, expanded radius
- `local`: radius = 120 miles, investigation-focused

Selection logic:
- Each band has explicit per-layer counts
- Bands change on zoom — not just CSS transform
- `isLayerVisible()` in store needs band-awareness

Files to create:
- `src/lib/map/camera-bands.ts`
- `src/lib/map/entity-priority.ts`
- `src/lib/map/entity-activation.ts`

---

## P1 — Atlas Contract

### [TODO] Implement opening atlas with quality gates

The broad-band opening atlas must satisfy (from master spec):

| Layer | Opening count |
|---|---|
| industrial-sites | 17 |
| pfas-sites | 10 |
| wastewater-sites | 8 |
| hazardous-sites | 1 |
| legal-markers | 8 |
| air-toxics-regions | 5 |
| **Total** | **49** |

Quality gates:
- PFAS: direct points only, no aggregates, geographic diversity
- Wastewater: prefer `epa-npdes` at broad scale
- Hazardous: at most 1, must have strong cleanup context
- Legal: cluster-truthful, not bland FRS registry text
- Air: `epa-echo` required, `legal_overlap >= 50` required

Files to create:
- `src/lib/data/atlas-cache.ts`
- `src/lib/data/query-params.ts`

---

## P1 — Validation Harness

### [TODO] Implement QA validation scripts

Required scripts (from master spec):
- `npm run qa:validate-home-atlas-cache`
- `npm run qa:validate-live-api`
- `npm run qa:validate-zoom-drilldown`
- `npm run qa:validate-local-focus-priority`
- `npm run qa:validate-browser-interactions`
- `npm run qa:validate-pfas-coverage-notes`
- `npm run qa:smoke`

---

## P2 — Local Runtime Scripts

### [TODO] Implement managed runtime scripts

Required (from master spec):
- `npm run local:up` — start DB + app
- `npm run local:down` — stop all
- `npm run local:status` — check runtime + health
- `npm run local:verify` — full verification run

---

## P2 — Air-Toxics Regions Rebalancing

### [TODO] Evaluate 6th air-toxics-region slot

(Applies once DB is populated and atlas is implemented)

Constraints:
- Do not regress any other opening atlas count
- `epa-echo` required
- `legal_overlap >= 50` required
- Only add a 6th region if it passes the same quality bar as the existing 5

---

## DONE

- [x] Phase 1 — Architecture, design system, UI shell
- [x] Phase 2 — Visual polish, motion, editorial UX
- [x] Phase 3 — Explorer wiring, mock entities, ETL scaffolding
- [x] Timeline milestone markers (historical context overlay)
- [x] Case study methodology notes surfaced on detail page
- [x] Sources page regrouped with quick stats
- [x] Root not-found page
- [x] OpenGraph / Twitter metadata
- [x] Dead import cleanup, React 19 lint fixes
- [x] fetch_tri.py upgraded to use shared ETL utils
- [x] ETL README updated
</content>
