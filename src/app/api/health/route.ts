import { NextResponse } from "next/server";
import { mockEntities, ENTITY_COUNTS } from "@/data/mock/entities";

/**
 * GET /api/health
 *
 * Returns runtime health summary including entity counts per layer and
 * current data mode. Used by local:verify and QA validation scripts.
 */
export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    dataMode: "mock" as "mock" | "database",
    readyForLocalUse: true,
    readyForFullLocalStack: false, // DB not yet populated

    // Entity counts
    totalEntities: mockEntities.length,
    totalLayers: 10,

    // Per-layer counts (mirrors ENTITY_COUNTS from entities.ts)
    industrialSites: ENTITY_COUNTS.industrial_sites,
    toxicReleaseRecords: ENTITY_COUNTS.toxic_releases,
    powerPlants: ENTITY_COUNTS.power_plants,
    hazardousSites: ENTITY_COUNTS.hazardous_sites,
    pfasSites: ENTITY_COUNTS.pfas_sites,
    wastewaterSites: ENTITY_COUNTS.wastewater,
    sentinelSpecies: ENTITY_COUNTS.sentinel_species,
    reproductiveRegions: ENTITY_COUNTS.reproductive_regions,
    caseStudyMarkers: ENTITY_COUNTS.case_study_markers,
    legalMarkers: ENTITY_COUNTS.legal_actions,

    // Source registry count
    sourceRegistry: 15, // matches mockSources.length

    // DB status
    database: {
      reachable: false,
      host: "localhost",
      port: 5432,
      database: "downstream",
    },
  };

  return NextResponse.json(health, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export const dynamic = "force-dynamic";
