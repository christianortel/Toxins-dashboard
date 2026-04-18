# TODO BACKLOG

Last updated: 2026-04-18

Ordered by leverage. Do not re-derive this list from scratch — reconcile with
`PROJECT_STATUS.md` and the live repo state before picking the next task.

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

Prerequisite: PostgreSQL instance running and schema applied (`db/schema.sql`).

---

## P1 — Atlas Contract Completion

### [TODO] Implement air-toxics region layer

The opening national atlas targets include 5 air-toxics-region entities.
Currently zero air-toxics entities exist in mock data.

Quality gates (from master spec):
- `epa-echo` source required
- `legal_overlap >= 50` required
- 5 opening regions; evaluate 6th only after real DB data

Files to create/modify:
- Add `air_toxics_regions` to `LayerId` type (or use `reproductive_regions` slot)
- Add 5+ mock entries to `src/data/mock/entities.ts`
- Update `NATIONAL_ATLAS_TARGETS` in `camera-bands.ts`

---

## P2 — Air-Toxics Regions Rebalancing

### [TODO] Evaluate 6th air-toxics-region slot

(Applies once DB is populated and layer is implemented)

Constraints:
- Do not regress any other opening atlas count
- `epa-echo` required
- `legal_overlap >= 50` required
- Only add a 6th region if it passes the same quality bar as the existing 5

---

## P2 — Map Shell Cleanup

### [TODO] Remove or archive map-shell.tsx

`src/components/explore/map-shell.tsx` still exists but is unused — ThreeGlobe
is now the primary renderer. Decision: delete or keep as fallback.

Risk: low. MapLibre dependency stays in package.json for now.

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
- [x] Phase 4 — Three.js WebGL globe (three-globe.tsx)
- [x] Phase 4 — API routes: /api/entities (GeoJSON), /api/health
- [x] Phase 4 — Camera band system (camera-bands.ts)
- [x] Phase 4 — Entity priority scoring and atlas selection (entity-priority.ts)
- [x] Phase 4 — Legend shell updated with camera band pill
- [x] Phase 4 — Explore store extended: cameraBand, setCameraDistance, isLayerVisible
- [x] Phase 4 — Atlas cache pre-computation (atlas-cache.ts)
- [x] Phase 4 — Query params builder (query-params.ts)
- [x] Phase 4 — QA validation harness (scripts/qa/)
  - qa:validate-home-atlas-cache (89 checks passing)
  - qa:validate-zoom-drilldown
  - qa:validate-local-focus-priority
  - qa:validate-browser-interactions
  - qa:validate-pfas-coverage-notes
  - qa:smoke (runs all offline validators)
- [x] Phase 4 — Local runtime scripts (scripts/local/)
  - local:up, local:down, local:status, local:verify
- [x] Continuity docs: PROJECT_STATUS.md, DECISIONS.md
