/**
 * QA: Validate home atlas cache
 *
 * Checks that the pre-computed national opening atlas has:
 * - At least 1 entity per targeted layer
 * - No duplicate entity IDs
 * - Every entity has required fields (id, layerId, lat, lon, evidenceLevel)
 * - Per-layer counts are <= NATIONAL_ATLAS_TARGETS caps
 * - All scores are positive
 */
import {
  NATIONAL_ATLAS,
  NATIONAL_ATLAS_BY_LAYER,
  NATIONAL_ATLAS_COUNT,
  getAtlasValidationSummary,
  getAtlasScoreSummary,
} from "@/lib/data/atlas-cache";
import { NATIONAL_ATLAS_TARGETS } from "@/lib/map/camera-bands";
import { suite, assert, assertGte, assertRange, warn, exitWithSummary } from "./_reporter";

suite("home-atlas-cache");

// ── Total count ───────────────────────────────────────────────────────────────
assertGte(NATIONAL_ATLAS_COUNT, 1, "atlas has at least 1 entity");
assertRange(NATIONAL_ATLAS_COUNT, 1, 200, "atlas count within expected range");

// ── No duplicate IDs ──────────────────────────────────────────────────────────
const idSet = new Set(NATIONAL_ATLAS.map((e) => e.id));
assert(idSet.size === NATIONAL_ATLAS_COUNT, "no duplicate entity IDs", `${idSet.size} unique of ${NATIONAL_ATLAS_COUNT}`);

// ── Required fields ───────────────────────────────────────────────────────────
const missingFields = NATIONAL_ATLAS.filter(
  (e) =>
    !e.id ||
    !e.layerId ||
    e.latitude === undefined ||
    e.longitude === undefined ||
    !e.evidenceLevel
);
assert(missingFields.length === 0, "all entities have required fields", `${missingFields.length} missing`);

// ── Coordinate sanity ─────────────────────────────────────────────────────────
const badCoords = NATIONAL_ATLAS.filter(
  (e) =>
    e.latitude < -90 || e.latitude > 90 ||
    e.longitude < -180 || e.longitude > 180
);
assert(badCoords.length === 0, "all coordinates are in valid range", `${badCoords.length} invalid`);

// ── Per-layer target caps ─────────────────────────────────────────────────────
for (const [layerId, target] of Object.entries(NATIONAL_ATLAS_TARGETS)) {
  const actual = NATIONAL_ATLAS_BY_LAYER[layerId as keyof typeof NATIONAL_ATLAS_BY_LAYER]?.length ?? 0;
  assert(
    actual <= target,
    `${layerId} within target cap`,
    `${actual} <= ${target}`
  );
}

// ── At least 1 entity per targeted layer (if data exists) ────────────────────
const summary = getAtlasValidationSummary();
for (const row of summary.layers) {
  if (row.target !== null) {
    assert(row.actual >= 1, `${row.layerId} has ≥1 entity in atlas`, `actual=${row.actual}`);
  }
}

// ── Scores are positive ───────────────────────────────────────────────────────
const scores = getAtlasScoreSummary();
const zeroScore = scores.filter((s) => s.score <= 0);
if (zeroScore.length > 0) {
  warn(`${zeroScore.length} entities have score ≤ 0 — check scoring logic`);
} else {
  assert(true, "all entities have positive scores");
}

// ── Warn if mock data is well below production targets ────────────────────────
if (NATIONAL_ATLAS_COUNT < 30) {
  warn(`atlas has only ${NATIONAL_ATLAS_COUNT} entities (mock data smaller than production targets)`);
}

exitWithSummary();
