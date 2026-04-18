import { NextRequest, NextResponse } from "next/server";
import { mockEntities, ENTITY_COUNTS } from "@/data/mock/entities";
import type { AnyMapEntity, LayerId, LayerGroupId } from "@/types";

/**
 * GET /api/entities
 *
 * Query params:
 *   layer   — filter by LayerId (comma-separated)
 *   group   — filter by LayerGroupId (comma-separated)
 *   year    — filter by timeline year (entity.year <= year <= entity.yearEnd)
 *   bbox    — filter by bounding box: "minLon,minLat,maxLon,maxLat"
 *   limit   — max results (default 500)
 *
 * Returns GeoJSON FeatureCollection.
 *
 * Data source: mock entities (Phase 3). DB-backed path to follow in Phase 4.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const layers = sp.get("layer")?.split(",").filter(Boolean) as LayerId[] | undefined;
  const groups = sp.get("group")?.split(",").filter(Boolean) as LayerGroupId[] | undefined;
  const year = sp.has("year") ? Number(sp.get("year")) : undefined;
  const bbox = sp.get("bbox");
  const limit = Math.min(Number(sp.get("limit") ?? 500), 2000);

  let entities: AnyMapEntity[] = mockEntities;

  // Layer filter
  if (layers && layers.length > 0) {
    const layerSet = new Set(layers);
    entities = entities.filter((e) => layerSet.has(e.layerId));
  }

  // Group filter
  if (groups && groups.length > 0) {
    const groupSet = new Set(groups);
    entities = entities.filter((e) => groupSet.has(e.layerGroup));
  }

  // Timeline filter
  if (year !== undefined && !isNaN(year)) {
    entities = entities.filter((e) => {
      if (e.year === undefined) return true;
      const end = e.yearEnd ?? 2030;
      return year >= e.year && year <= end;
    });
  }

  // Bounding box filter
  if (bbox) {
    const [minLon, minLat, maxLon, maxLat] = bbox.split(",").map(Number);
    if (!isNaN(minLon) && !isNaN(minLat) && !isNaN(maxLon) && !isNaN(maxLat)) {
      entities = entities.filter(
        (e) =>
          e.longitude >= minLon &&
          e.longitude <= maxLon &&
          e.latitude >= minLat &&
          e.latitude <= maxLat
      );
    }
  }

  // Limit
  entities = entities.slice(0, limit);

  const featureCollection: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: entities.map((e) => ({
      type: "Feature",
      id: e.id,
      geometry: {
        type: "Point",
        coordinates: [e.longitude, e.latitude],
      },
      properties: {
        id: e.id,
        name: e.name,
        layerId: e.layerId,
        layerGroup: e.layerGroup,
        evidenceLevel: e.evidenceLevel,
        year: e.year ?? null,
        yearEnd: e.yearEnd ?? null,
        county: e.county,
        state: e.state,
        tags: e.tags,
      },
    })),
  };

  return NextResponse.json(featureCollection, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

export const dynamic = "force-dynamic";
export { ENTITY_COUNTS };
