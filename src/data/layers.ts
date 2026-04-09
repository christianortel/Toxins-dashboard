import type { DataLayer, LayerGroupId, LayerId } from "@/types";
import { LAYER_GROUPS } from "@/lib/constants";
import { ENTITY_COUNTS } from "@/data/mock/entities";

/**
 * Central registry of every data layer in the DOWNSTREAM application.
 * Each entry maps a LayerId to its full configuration.
 */
export const LAYERS: Record<LayerId, DataLayer> = {
  industrial_sites: {
    id: "industrial_sites",
    group: "official",
    label: "Industrial Facilities",
    description:
      "TRI-reporting industrial facilities tracked by the EPA, including chemical manufacturers, refineries, and processing plants.",
    evidenceLevel: "direct",
    sourceIds: ["tri"],
    enabled: true,
    entityCount: ENTITY_COUNTS.industrial_sites,
  },
  toxic_releases: {
    id: "toxic_releases",
    group: "official",
    label: "Toxic Releases",
    description:
      "Annual toxic chemical release data reported through the EPA Toxics Release Inventory. Shares facility entities with the Industrial Facilities layer.",
    evidenceLevel: "direct",
    sourceIds: ["tri"],
    enabled: true,
    entityCount: ENTITY_COUNTS.toxic_releases,
  },
  power_plants: {
    id: "power_plants",
    group: "official",
    label: "Power Plants",
    description:
      "Fossil fuel power generation facilities, including coal, natural gas, and oil-fired plants, with associated emissions data.",
    evidenceLevel: "direct",
    sourceIds: ["tri"],
    enabled: true,
    entityCount: ENTITY_COUNTS.power_plants,
  },
  hazardous_sites: {
    id: "hazardous_sites",
    group: "official",
    label: "Hazardous Sites",
    description:
      "Superfund and National Priorities List (NPL) sites designated for long-term remedial cleanup of hazardous waste contamination.",
    evidenceLevel: "direct",
    sourceIds: ["superfund"],
    enabled: true,
    entityCount: ENTITY_COUNTS.hazardous_sites,
  },
  pfas_sites: {
    id: "pfas_sites",
    group: "emerging",
    label: "PFAS Contamination",
    description:
      "Sites where per- and polyfluoroalkyl substances (PFAS) have been detected in water, soil, or biota through federal and state testing programs.",
    evidenceLevel: "direct",
    sourceIds: ["pfas-testing"],
    enabled: true,
    entityCount: ENTITY_COUNTS.pfas_sites,
  },
  wastewater: {
    id: "wastewater",
    group: "emerging",
    label: "Wastewater Discharge",
    description:
      "Wastewater treatment plant (WWTP) monitoring data, including discharge volumes, permit violations, and contaminant screening results.",
    evidenceLevel: "screening",
    sourceIds: ["pfas-testing", "echo-enforcement"],
    enabled: true,
    entityCount: ENTITY_COUNTS.wastewater,
  },
  sentinel_species: {
    id: "sentinel_species",
    group: "wildlife",
    label: "Sentinel Species",
    description:
      "Observations of wildlife abnormalities, reproductive disruption, and population declines used as proxy indicators for environmental contamination.",
    evidenceLevel: "proxy",
    sourceIds: ["usgs-endocrine", "sentinel-amphibians"],
    enabled: false,
    entityCount: ENTITY_COUNTS.sentinel_species,
  },
  reproductive_regions: {
    id: "reproductive_regions",
    group: "reproductive",
    label: "Reproductive Indicators",
    description:
      "Regional population-level fertility and reproductive health trends, including sperm count data and birth outcome statistics.",
    evidenceLevel: "screening",
    sourceIds: ["cdc-reproductive", "sperm-meta"],
    enabled: false,
    entityCount: ENTITY_COUNTS.reproductive_regions,
  },
  case_study_markers: {
    id: "case_study_markers",
    group: "regulatory",
    label: "Investigations",
    description:
      "Locations featured in DOWNSTREAM in-depth case studies, marking sites of particular investigative interest.",
    evidenceLevel: "editorial",
    sourceIds: ["echo-enforcement"],
    enabled: false,
    entityCount: ENTITY_COUNTS.case_study_markers,
  },
  legal_actions: {
    id: "legal_actions",
    group: "regulatory",
    label: "Legal & Regulatory",
    description:
      "Enforcement actions, consent decrees, and legal settlements related to environmental violations and contamination.",
    evidenceLevel: "literature",
    sourceIds: ["echo-enforcement"],
    enabled: false,
    entityCount: ENTITY_COUNTS.legal_actions,
  },
};

/** Ordered array of all layer IDs. */
export const LAYER_IDS: LayerId[] = Object.keys(LAYERS) as LayerId[];

/**
 * Returns all DataLayer entries belonging to the given group.
 */
export function getLayersByGroup(groupId: LayerGroupId): DataLayer[] {
  return LAYER_IDS.filter((id) => LAYERS[id].group === groupId).map(
    (id) => LAYERS[id],
  );
}

/**
 * Returns the CSS color variable associated with the layer's group.
 */
export function getLayerColor(layerId: LayerId): string {
  const group = LAYERS[layerId].group;
  return LAYER_GROUPS[group].color;
}
