# DECISIONS

Architectural decisions, rationale, and constraints.
Update whenever a significant decision is made or reversed.

---

## Renderer: MapLibre GL → Three.js Globe

**Status**: Transition planned (Phase 4)
**Current**: MapLibre GL JS (2D map, `map-shell.tsx`)
**Target**: Three.js 3D sphere (canvas-backed)

**Rationale**: The product vision is a globe-first investigation surface.
A 3D sphere communicates environmental data at scale better than a 2D tile map
and enables the camera band / zoom-level interaction model described in the
master spec.

**Constraint**: Cesium is diagnostic-only. Three.js is the chosen renderer.
Do not revert to MapLibre for production globe rendering.

---

## Data Mode: Mock → DB-backed with mock fallback

**Status**: Mock only (Phase 3 complete). DB path planned (Phase 4).
**Current**: 43 entities in `src/data/mock/entities.ts`
**Target**: PostgreSQL + PostGIS with DB client singleton in `src/db/client.ts`

**Rationale**: Real environmental data at scale (383k+ entities) cannot be
reasonably mocked. DB-backed source truth is non-negotiable for the real product.

**Rule**: Do not promote a layer to `database` mode unless:
- Atlas-ready rows exist
- Geospatial rows are real and usable
- The display path is validated
- Live API route is proven to use those DB rows

---

## State Management: Zustand

**Status**: Implemented
**File**: `src/stores/explore-store.ts`

**Decision**: Zustand for all explorer state (active layers/groups, selected
entity, timeline year, search, legend). Set types for toggleable sets.
No Redux, no Context for this concern.

---

## Routing: Next.js App Router

**Status**: Implemented
**Version**: Next.js 16 (Turbopack)

**Decision**: App Router throughout. No Pages Router. `"use client"` only
where needed (interactive components). Static generation where possible.

---

## Layer System: Two-Level Toggle

**Status**: Implemented
**Files**: `src/stores/explore-store.ts`, `src/data/layers.ts`

**Decision**: Group toggles cascade to layer toggles. Fine-grained layer
control available within active groups. `isLayerVisible(layerId)` checks
both group and layer activation.

**Camera band extension** (planned): `isLayerVisible()` will need a
`cameraband` parameter once the globe is implemented.

---

## Entity Model: Discriminated Union

**Status**: Implemented
**File**: `src/types/index.ts`

**Decision**: `AnyMapEntity` = discriminated union of 9 subtypes keyed by
`layerId`. Each subtype carries a typed `meta` payload. This allows the
detail drawer to render layer-specific UI without runtime casting.

---

## ETL: Python + shared utils

**Status**: Scaffolded
**Files**: `etl/scripts/utils.py`, `etl/scripts/fetch_*.py`

**Decision**: Shared `utils.py` with logger, HTTP retry (exp backoff),
`step()` timer, `is_dry_run()`. Each fetcher is standalone and runnable.
Output: newline-delimited JSON in `etl/data/raw/<source>/`.

**Env var**: `DOWNSTREAM_ETL_DRY_RUN=1` prevents network calls.

---

## Evidence Levels: 5-tier taxonomy

**Status**: Implemented
**File**: `src/lib/constants.ts`

Tiers: `direct`, `proxy`, `screening`, `literature`, `editorial`
These labels travel with entities through the entire UI (map, drawer,
case studies, legend). They are transparency tools, not value judgments.

---

## Opening Atlas: Quality-Gated Selection

**Status**: Not yet implemented (Phase 5)

**Decision**: The opening atlas is intentionally bounded and not a dump
of all available data. Selection is quality-gated by layer-specific rules.
Do not change atlas counts without verifying the replacement row is at
least as investigation-useful as what it replaces.

**Constraint**: Air-toxics regions require `epa-echo` context and
`legal_overlap >= 50`. This prevents generic burden wallpaper.

---

## Camera Bands: Explicit Product States

**Status**: Not yet implemented (Phase 5)

**Decision**: `national` / `regional` / `local` are meaningful product
states, not just zoom levels. Entity selection logic, radius, and ranking
all change between bands. Local radius = 120 miles.

---

## Click Behavior: Dense vs. Concrete

**Status**: Planned

Dense-click upgrades (show "best of" from a cluster) allowed only for:
- `industrial-sites`, `power-plants`, `air-toxics-regions`,
  `reproductive-regions`, `sentinel-species`

Explicit-click preservation required for:
- `pfas-sites`, `wastewater-sites`, `hazardous-sites`, `legal-markers`

---

## Public SVGs: Removed

**Decision**: Deleted orphan Next.js template SVGs (`next.svg`, `vercel.svg`,
`file.svg`, `globe.svg`, `window.svg`) from `public/`. None referenced.
</content>
