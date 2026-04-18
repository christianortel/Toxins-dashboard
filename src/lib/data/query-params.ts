import type { LayerId, LayerGroupId } from "@/types";
import type { CameraBand } from "@/lib/map/camera-bands";

export interface EntityQueryOptions {
  layers?: LayerId[];
  groups?: LayerGroupId[];
  year?: number;
  /** [minLon, minLat, maxLon, maxLat] */
  bbox?: [number, number, number, number];
  limit?: number;
  band?: CameraBand;
}

/** Build URLSearchParams for GET /api/entities */
export function buildEntityQueryParams(opts: EntityQueryOptions): URLSearchParams {
  const p = new URLSearchParams();
  if (opts.layers?.length) p.set("layer", opts.layers.join(","));
  if (opts.groups?.length) p.set("group", opts.groups.join(","));
  if (opts.year !== undefined) p.set("year", String(opts.year));
  if (opts.bbox) p.set("bbox", opts.bbox.join(","));
  if (opts.limit !== undefined) p.set("limit", String(opts.limit));
  return p;
}

/** Build a full /api/entities URL for a given base URL */
export function buildEntityUrl(baseUrl: string, opts: EntityQueryOptions): string {
  const params = buildEntityQueryParams(opts);
  const qs = params.toString();
  return qs ? `${baseUrl}/api/entities?${qs}` : `${baseUrl}/api/entities`;
}

/** Band-specific default query options */
export const BAND_QUERY_DEFAULTS: Record<CameraBand, Partial<EntityQueryOptions>> = {
  national: { limit: 100 },
  regional: { limit: 300 },
  local:    { limit: 500 },
};
