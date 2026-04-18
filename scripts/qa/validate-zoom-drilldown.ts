/**
 * QA: Validate zoom/camera band drilldown logic
 *
 * Tests that distanceToBand() returns correct bands at boundary conditions,
 * and that isLayerEnabledForBand() follows the expected gating rules.
 */
import { distanceToBand, BAND_THRESHOLDS, isLayerEnabledForBand } from "@/lib/map/camera-bands";
import { suite, assert, exitWithSummary } from "./_reporter";

suite("zoom-drilldown");

// ── Band boundary correctness ─────────────────────────────────────────────────
const { national, regional, local } = BAND_THRESHOLDS;

assert(distanceToBand(national.maxDist) === "national", "max dist → national");
assert(distanceToBand(national.minDist) === "national", "national min boundary → national");
assert(distanceToBand(national.minDist - 0.01) === "regional", "just below national → regional");
assert(distanceToBand(regional.minDist) === "regional", "regional min boundary → regional");
assert(distanceToBand(regional.minDist - 0.01) === "local", "just below regional → local");
assert(distanceToBand(0) === "local", "zero dist → local");
assert(distanceToBand(1.0) === "local", "close zoom → local");
assert(distanceToBand(2.5) === "national", "default opening camera → national");

// ── Layer gating at national band ─────────────────────────────────────────────
const nationalLayers = ["industrial_sites", "pfas_sites", "wastewater", "hazardous_sites", "legal_actions", "power_plants"] as const;
const blockedAtNational = ["sentinel_species", "reproductive_regions", "case_study_markers", "toxic_releases"] as const;

for (const layerId of nationalLayers) {
  assert(isLayerEnabledForBand(layerId, "national"), `${layerId} enabled at national`);
}

for (const layerId of blockedAtNational) {
  assert(!isLayerEnabledForBand(layerId, "national"), `${layerId} blocked at national`);
}

// ── All layers pass through at regional and local ─────────────────────────────
const allLayers = [...nationalLayers, ...blockedAtNational] as const;
for (const layerId of allLayers) {
  assert(isLayerEnabledForBand(layerId, "regional"), `${layerId} enabled at regional`);
  assert(isLayerEnabledForBand(layerId, "local"), `${layerId} enabled at local`);
}

// ── Band ordering sanity ──────────────────────────────────────────────────────
assert(
  national.minDist > regional.minDist,
  "national threshold > regional threshold"
);
assert(
  regional.minDist > local.minDist,
  "regional threshold > local threshold"
);

exitWithSummary();
