/**
 * QA: Validate local-band entity focus and priority ranking
 *
 * Tests that rankLocalEntities() returns closer entities first,
 * that scoring is distance-penalized, and that evidence tiers
 * produce the expected score ordering.
 */
import { rankLocalEntities, scoreEntity } from "@/lib/map/entity-priority";
import { mockEntities } from "@/data/mock/entities";
import type { AnyMapEntity } from "@/types";
import { suite, assert, assertGte, warn, exitWithSummary } from "./_reporter";

suite("local-focus-priority");

// ── rankLocalEntities returns all input entities ──────────────────────────────
const sample = mockEntities.slice(0, 20);
const ranked = rankLocalEntities(sample, 39.5, -98.5, "local");
assert(ranked.length === sample.length, "rankLocalEntities preserves entity count");

// ── Closer entity outranks far entity (same layer, same evidence) ─────────────
// Synthetic test: two identical entities, different coords
const closeEntity: AnyMapEntity = {
  ...mockEntities[0],
  id: "qa-close",
  latitude: 39.5,
  longitude: -98.5,
};
const farEntity: AnyMapEntity = {
  ...mockEntities[0],
  id: "qa-far",
  latitude: 10.0,
  longitude: -10.0,
};

const [first] = rankLocalEntities([closeEntity, farEntity], 39.5, -98.5, "local");
assert(first.id === "qa-close", "closer entity ranks first in local band");

// ── Evidence level scoring is correctly ordered ───────────────────────────────
const levels = ["direct", "proxy", "screening", "literature", "editorial"] as const;
const syntheticBase = {
  layerId: "pfas_sites" as const,
  layerGroup: "official" as const,
  name: "QA test",
  latitude: 39.5,
  longitude: -98.5,
  state: "KS",
  county: "Test",
  summary: "",
  sourceIds: [],
  tags: [],
  meta: { siteType: "qa", pfasCompounds: [], mediumTested: "water" },
};

let prevScore = Infinity;
let scoringOk = true;
for (const level of levels) {
  const e = { ...syntheticBase, id: `qa-${level}`, evidenceLevel: level } as AnyMapEntity;
  const score = scoreEntity(e, "national");
  if (score >= prevScore) {
    scoringOk = false;
    break;
  }
  prevScore = score;
}
assert(scoringOk, "evidence levels produce descending scores: direct > proxy > screening > literature > editorial");

// ── scoreEntity returns a positive number for valid entities ──────────────────
const allScores = mockEntities.map((e) => scoreEntity(e, "national"));
const positiveScores = allScores.filter((s) => s > 0);
assertGte(positiveScores.length, mockEntities.length * 0.8, "≥80% of entities have positive national score");

const localScores = mockEntities.map((e) => scoreEntity(e, "local"));
const positiveLocalScores = localScores.filter((s) => s > 0);
assertGte(positiveLocalScores.length, mockEntities.length * 0.8, "≥80% of entities have positive local score");

// ── Warn if all entities have the same score (scoring may be degenerate) ──────
const uniqueScores = new Set(allScores);
if (uniqueScores.size < 3) {
  warn(`only ${uniqueScores.size} unique scores across ${mockEntities.length} entities — scoring may be too flat`);
} else {
  assert(true, `score diversity OK (${uniqueScores.size} unique scores)`);
}

exitWithSummary();
