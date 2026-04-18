import type { LayerId } from "@/types";

/**
 * Camera bands are explicit product states, not just visual zoom levels.
 *
 * Each band controls which layers are visible, how many entities surface,
 * and at what quality threshold they qualify for display.
 */

export type CameraBand = "national" | "regional" | "local";

/** Globe camera distance mapped to bands */
export const BAND_THRESHOLDS = {
  national: { minDist: 1.9, maxDist: 5.0 },   // zoomed out, broad atlas
  regional: { minDist: 1.55, maxDist: 1.9 },   // mid zoom
  local:    { minDist: 0,    maxDist: 1.55 },   // close zoom, investigation
} satisfies Record<CameraBand, { minDist: number; maxDist: number }>;

/** Derive the current camera band from Three.js camera distance to origin */
export function distanceToBand(distance: number): CameraBand {
  if (distance >= BAND_THRESHOLDS.national.minDist) return "national";
  if (distance >= BAND_THRESHOLDS.regional.minDist) return "regional";
  return "local";
}

/**
 * Opening atlas per-layer entity counts (national band only).
 * These are quality-gated targets — not hard caps.
 *
 * Phase 3 mock data is smaller than the target counts; once real DB data
 * is ingested these caps will drive atlas selection logic.
 */
export const NATIONAL_ATLAS_TARGETS: Partial<Record<LayerId, number>> = {
  industrial_sites:     17,
  pfas_sites:           10,
  wastewater:            8,
  hazardous_sites:       1,
  legal_actions:         8,
  // air-toxics would be a derived layer: 5 (future)
};

/** Local investigation radius in miles */
export const LOCAL_RADIUS_MILES = 120;

/**
 * Layer visibility rules per camera band.
 *
 * Returns true if a layer should be considered for display at the given band.
 * This is a soft gate — the store's activeGroups/activeLayers still govern
 * whether the user has toggled the layer on.
 */
export function isLayerEnabledForBand(
  layerId: LayerId,
  band: CameraBand
): boolean {
  // All explicitly-toggled layers are visible in regional and local bands
  if (band === "local" || band === "regional") return true;

  // National band: concrete layers only by default
  const nationalLayers: Set<LayerId> = new Set([
    "industrial_sites",
    "pfas_sites",
    "wastewater",
    "hazardous_sites",
    "legal_actions",
    "power_plants",
  ]);
  return nationalLayers.has(layerId);
}

/**
 * Click upgrade behavior per layer.
 *
 * "dense" layers open a cluster summary on click (show best-of context).
 * "concrete" layers must preserve the exact clicked entity in the drawer.
 */
export const CLICK_BEHAVIOR: Record<LayerId, "dense" | "concrete"> = {
  industrial_sites:     "dense",
  toxic_releases:       "dense",
  power_plants:         "dense",
  hazardous_sites:      "concrete",
  pfas_sites:           "concrete",
  wastewater:           "concrete",
  sentinel_species:     "dense",
  reproductive_regions: "dense",
  case_study_markers:   "concrete",
  legal_actions:        "concrete",
};
