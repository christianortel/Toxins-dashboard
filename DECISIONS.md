# DECISIONS

Architectural decisions, rationale, and constraints.
Update whenever a significant decision is made or reversed.

---

## Renderer: Three.js Globe ✅

**Status**: Implemented
**File**: `src/components/explore/three-globe.tsx`

Three.js r184 3D sphere with custom GLSL shaders. Earth night texture loaded
from `unpkg.com/three-globe`. Entity points rendered as `THREE.Points` with
per-vertex color and size attributes. OrbitControls for user interaction.

**Previous**: MapLibre GL JS (2D map) — removed in Phase 5 (`map-shell.tsx` deleted).
**Constraint**: Cesium is diagnostic-only. Three.js is the chosen renderer.

---

## Data Mode: Mock with DB-fallback architecture ✅

**Status**: Mock mode running. DB path scaffolded but not populated.
**Current**: 43 entities in `src/data/mock/entities.ts`
**Target**: PostgreSQL + PostGIS with DB client singleton

**Rule**: Do not promote a layer to `database` mode unless:
- Atlas-ready rows exist
- Geospatial rows are real and usable
- The display path is validated
- Live API route is proven to use those DB rows

---

## Camera Bands: Explicit Product States ✅

**Status**: Implemented
**File**: `src/lib/map/camera-bands.ts`

`national` / `regional` / `local` are meaningful product states, not just zoom
levels. Entity selection logic, layer visibility, and ranking all change between
bands. Derived from `camera.position.length()` in the Three.js render loop.

Thresholds: national ≥ 1.9, regional ≥ 1.55, local < 1.55.
Local radius = 120 miles.

---

## Opening Atlas: Quality-Gated Selection ✅

**Status**: Implemented
**Files**: `src/lib/map/entity-priority.ts`, `src/lib/data/atlas-cache.ts`

The opening national atlas is quality-gated per layer with explicit target caps.
`selectNationalAtlas()` groups by layer, scores with `scoreEntity()`, and takes
the top N per layer. Atlas cache is pre-computed at module load.

Target counts: industrial 17, PFAS 10, wastewater 8, hazardous 1, legal 8.
Actual (mock): industrial 6, PFAS 6, wastewater 4, hazardous 1, legal 4 = 40 total.

---

## Click Behavior: Dense vs. Concrete ✅

**Status**: Implemented
**File**: `src/lib/map/camera-bands.ts` (`CLICK_BEHAVIOR`)

Dense-click upgrades (show "best of" from a cluster):
- `industrial_sites`, `toxic_releases`, `power_plants`, `sentinel_species`, `reproductive_regions`

Explicit-click preservation:
- `hazardous_sites`, `pfas_sites`, `wastewater`, `case_study_markers`, `legal_actions`

---

## State Management: Zustand ✅

**Status**: Implemented
**File**: `src/stores/explore-store.ts`

Zustand for all explorer state (active layers/groups, selected entity, timeline,
search, legend, camera band/distance). Set types for toggleable collections.
`isLayerVisible(layerId)` checks group + layer + camera band.

---

## Routing: Next.js App Router ✅

**Status**: Implemented
**Version**: Next.js 16 (Turbopack)

App Router throughout. `"use client"` only for interactive components.
Static generation where possible. API routes: `force-dynamic`.

---

## Layer System: Two-Level Toggle ✅

**Status**: Implemented

Group toggles cascade to layer toggles. Fine-grained layer control available
within active groups. `isLayerVisible(layerId)` checks group, layer, AND
camera band activation.

---

## Entity Model: Discriminated Union ✅

**Status**: Implemented
**File**: `src/types/index.ts`

`AnyMapEntity` = discriminated union of 9 subtypes keyed by `layerId`.
Each subtype carries a typed `meta` payload. The detail drawer renders
layer-specific UI via switch on `entity.layerId` without runtime casting.

---

## Evidence Levels: 5-tier taxonomy ✅

**Status**: Implemented

Tiers: `direct`, `proxy`, `screening`, `literature`, `editorial`
These labels travel with entities through the entire UI. They are transparency
tools, not value judgments.

---

## ETL: Python + shared utils

**Status**: Scaffolded (not yet run)
**Files**: `etl/scripts/utils.py`, `etl/scripts/fetch_*.py`

Shared `utils.py` with logger, HTTP retry (exp backoff), `step()` timer,
`is_dry_run()`. Each fetcher is standalone. Output: NDJSON in `etl/data/raw/`.

---

## Dependency Cleanup ✅

**Status**: Completed 2026-04-21

Removed 7 unused production dependencies:
- `@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/mapbox`, `@deck.gl/react` (replaced by Three.js)
- `maplibre-gl` (replaced by Three.js)
- `@tanstack/react-query` (never wired)
- `d3` + `@types/d3` (never imported)

Removed dead MapLibre CSS overrides from `globals.css`.
Deleted `map-shell.tsx` and orphan template SVGs.
