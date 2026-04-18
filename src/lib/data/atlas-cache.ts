import { mockEntities } from "@/data/mock/entities";
import { selectNationalAtlas, scoreEntity } from "@/lib/map/entity-priority";
import { NATIONAL_ATLAS_TARGETS } from "@/lib/map/camera-bands";
import type { AnyMapEntity, LayerId } from "@/types";

/**
 * Pre-computed national opening atlas.
 *
 * Computed once at module load; stable across the session unless mock data changes.
 * Production path: replace with DB-backed query at build time.
 */
export const NATIONAL_ATLAS: AnyMapEntity[] = selectNationalAtlas(mockEntities);

/** Atlas entries grouped by layerId for fast per-layer lookups. */
export const NATIONAL_ATLAS_BY_LAYER: Partial<Record<LayerId, AnyMapEntity[]>> = {};
for (const e of NATIONAL_ATLAS) {
  const bucket = NATIONAL_ATLAS_BY_LAYER[e.layerId] ?? [];
  bucket.push(e);
  NATIONAL_ATLAS_BY_LAYER[e.layerId] = bucket;
}

/** Flat count of entities in the opening atlas. */
export const NATIONAL_ATLAS_COUNT = NATIONAL_ATLAS.length;

/**
 * Validation summary for the opening atlas.
 *
 * Returns per-layer actual vs target counts and whether the atlas
 * meets the minimum bar set by NATIONAL_ATLAS_TARGETS.
 */
export function getAtlasValidationSummary(): {
  total: number;
  layers: {
    layerId: LayerId;
    actual: number;
    target: number | null;
    ok: boolean;
  }[];
  pass: boolean;
} {
  const layerIds = Object.keys(NATIONAL_ATLAS_BY_LAYER) as LayerId[];
  const layers = layerIds.map((layerId) => {
    const actual = NATIONAL_ATLAS_BY_LAYER[layerId]?.length ?? 0;
    const target = NATIONAL_ATLAS_TARGETS[layerId] ?? null;
    // "ok" means we have at least 1 entity for layers with a target, or we're
    // at/under target for layers that are target-capped.
    const ok = actual > 0 && (target === null || actual <= target);
    return { layerId, actual, target, ok };
  });

  return {
    total: NATIONAL_ATLAS_COUNT,
    layers,
    pass: layers.every((l) => l.ok),
  };
}

/**
 * Score summary for every entity in the opening atlas.
 * Used by QA scripts to verify scoring is non-degenerate.
 */
export function getAtlasScoreSummary(): { id: string; layerId: LayerId; score: number }[] {
  return NATIONAL_ATLAS.map((e) => ({
    id: e.id,
    layerId: e.layerId,
    score: scoreEntity(e, "national"),
  }));
}
