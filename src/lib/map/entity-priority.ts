import type { AnyMapEntity, LayerId } from "@/types";
import { type CameraBand, NATIONAL_ATLAS_TARGETS } from "./camera-bands";

/**
 * Entity priority scoring for atlas selection.
 *
 * Higher score = more likely to surface at a given camera band.
 * Scores are band-aware: national band uses quality-gate logic,
 * regional/local use investigation-relevance scoring.
 */

// ─── Score helpers ─────────────────────────────────────────────────────────────

function evidenceScore(level: AnyMapEntity["evidenceLevel"]): number {
  switch (level) {
    case "direct":    return 40;
    case "proxy":     return 30;
    case "screening": return 20;
    case "literature":return 15;
    case "editorial": return 5;
    default:          return 0;
  }
}

function layerBaseScore(layerId: LayerId): number {
  // Concrete investigation layers outrank derived/aggregate layers
  switch (layerId) {
    case "pfas_sites":          return 50;
    case "wastewater":          return 45;
    case "hazardous_sites":     return 40;
    case "industrial_sites":    return 35;
    case "legal_actions":       return 35;
    case "power_plants":        return 25;
    case "case_study_markers":  return 25;
    case "sentinel_species":    return 20;
    case "reproductive_regions":return 15;
    case "toxic_releases":      return 10;
    default:                    return 0;
  }
}

/** Score an entity for display priority at a given camera band. */
export function scoreEntity(e: AnyMapEntity, band: CameraBand): number {
  let score = layerBaseScore(e.layerId) + evidenceScore(e.evidenceLevel);

  if (band === "national") {
    // National band favors geographic diversity — no bonus for clustering
    // Favor entities with more complete metadata
    const meta = e.meta as Record<string, unknown>;
    if (Array.isArray(meta.chemicals) && meta.chemicals.length > 0) score += 8;
    if (Array.isArray(meta.contaminants) && meta.contaminants.length > 0) score += 8;
    if (Array.isArray(meta.pfasCompounds) && meta.pfasCompounds.length > 0) score += 10;
    if (meta.triId || meta.npdesPermit) score += 5;
  }

  if (band === "local") {
    // Local band: distance from view center matters most (handled separately)
    // Slight bump for entities with violations/enforcement context
    const meta = e.meta as Record<string, unknown>;
    if (typeof meta.violationsCount === "number" && meta.violationsCount > 0) score += 12;
    if (meta.epaId) score += 5;
  }

  return score;
}

// ─── Atlas selection ───────────────────────────────────────────────────────────

/**
 * Select the opening national atlas from a pool of entities.
 *
 * Applies per-layer target counts from NATIONAL_ATLAS_TARGETS.
 * Within each layer, picks the highest-scoring entities.
 * Returns a flat array of selected entities in display order.
 */
export function selectNationalAtlas(
  entities: AnyMapEntity[]
): AnyMapEntity[] {
  // Group by layer
  const byLayer = new Map<LayerId, AnyMapEntity[]>();
  for (const e of entities) {
    const arr = byLayer.get(e.layerId) ?? [];
    arr.push(e);
    byLayer.set(e.layerId, arr);
  }

  const selected: AnyMapEntity[] = [];

  for (const [layerId, pool] of byLayer.entries()) {
    const target = NATIONAL_ATLAS_TARGETS[layerId] ?? Infinity;
    // Score and sort descending
    const scored = pool
      .map((e) => ({ e, score: scoreEntity(e, "national") }))
      .sort((a, b) => b.score - a.score)
      .slice(0, target)
      .map((x) => x.e);
    selected.push(...scored);
  }

  return selected;
}

/**
 * Sort a local/regional entity pool for investigation display.
 *
 * Entities closer to `centerLat/Lon` get a distance bonus.
 * Within same distance bucket, higher evidence + layer score wins.
 */
export function rankLocalEntities(
  entities: AnyMapEntity[],
  centerLat: number,
  centerLon: number,
  band: CameraBand
): AnyMapEntity[] {
  const deg2rad = (d: number) => (d * Math.PI) / 180;
  const R = 3959; // Earth radius in miles

  function distanceMiles(lat: number, lon: number): number {
    const dLat = deg2rad(lat - centerLat);
    const dLon = deg2rad(lon - centerLon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(centerLat)) *
        Math.cos(deg2rad(lat)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return entities
    .map((e) => {
      const dist = distanceMiles(e.latitude, e.longitude);
      // Distance penalty: -1 point per 10 miles
      const distPenalty = dist / 10;
      const score = scoreEntity(e, band) - distPenalty;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.e);
}
