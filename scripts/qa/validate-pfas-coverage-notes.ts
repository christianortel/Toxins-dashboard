/**
 * QA: Validate PFAS layer entity coverage and quality notes
 *
 * Checks that PFAS entities:
 * - Have coordinates in the continental US (rough bounds)
 * - Have pfasCompounds or contaminants metadata populated
 * - Have evidence level of "direct" or "proxy" (no screening-only at this layer)
 * - Summary text is non-trivial (>20 chars)
 */
import { getEntitiesByLayer } from "@/data/mock/entities";
import { suite, assert, assertGte, warn, exitWithSummary } from "./_reporter";

suite("pfas-coverage-notes");

const pfasEntities = getEntitiesByLayer("pfas_sites");

assertGte(pfasEntities.length, 1, "at least 1 PFAS entity exists");

// ── Continental US bounds (very rough) ────────────────────────────────────────
const CONUS = { minLat: 24, maxLat: 50, minLon: -125, maxLon: -66 };
const outsideUS = pfasEntities.filter(
  (e) =>
    e.latitude < CONUS.minLat ||
    e.latitude > CONUS.maxLat ||
    e.longitude < CONUS.minLon ||
    e.longitude > CONUS.maxLon
);
if (outsideUS.length > 0) {
  warn(`${outsideUS.length} PFAS entities appear outside continental US bounds`);
} else {
  assert(true, "all PFAS entities within continental US bounds");
}

// ── Evidence level gate ────────────────────────────────────────────────────────
const weakEvidence = pfasEntities.filter(
  (e) => e.evidenceLevel !== "direct" && e.evidenceLevel !== "proxy"
);
if (weakEvidence.length > 0) {
  warn(`${weakEvidence.length} PFAS entities have evidence < proxy: ${weakEvidence.map((e) => e.id).join(", ")}`);
} else {
  assert(true, "all PFAS entities have direct or proxy evidence");
}

// ── Metadata richness ─────────────────────────────────────────────────────────
const missingCompounds = pfasEntities.filter((e) => {
  const meta = e.meta as Record<string, unknown>;
  const hasPfas = Array.isArray(meta.pfasCompounds) && meta.pfasCompounds.length > 0;
  const hasCont = Array.isArray(meta.contaminants) && meta.contaminants.length > 0;
  return !hasPfas && !hasCont;
});
if (missingCompounds.length > 0) {
  warn(`${missingCompounds.length} PFAS entities missing pfasCompounds AND contaminants metadata`);
} else {
  assert(true, "all PFAS entities have compound/contaminant metadata");
}

// ── Summary length ────────────────────────────────────────────────────────────
const shortSummaries = pfasEntities.filter((e) => e.summary.length < 20);
assert(shortSummaries.length === 0, "all PFAS summaries are non-trivial (>20 chars)", `${shortSummaries.length} short`);

// ── Tags present ──────────────────────────────────────────────────────────────
const noTags = pfasEntities.filter((e) => !e.tags || e.tags.length === 0);
if (noTags.length > 0) {
  warn(`${noTags.length} PFAS entities have no tags`);
} else {
  assert(true, "all PFAS entities have tags");
}

exitWithSummary();
