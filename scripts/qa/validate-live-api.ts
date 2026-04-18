/**
 * QA: Validate live API endpoints
 *
 * Hits the running dev/prod server and checks:
 * - GET /api/health — returns expected shape
 * - GET /api/entities — returns valid GeoJSON FeatureCollection
 * - GET /api/entities?layer=pfas_sites — filters correctly
 * - GET /api/entities?bbox=... — spatial filter works
 *
 * Requires the server to be running at BASE_URL (default: http://localhost:3000).
 * Set BASE_URL env var to override.
 */
import { suite, assert, assertGte, fail, warn, exitWithSummary } from "./_reporter";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

async function get(path: string): Promise<{ ok: boolean; status: number; data: unknown }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

async function main() {
  suite(`live-api (${BASE_URL})`);

  // ── /api/health ─────────────────────────────────────────────────────────────
  const health = await get("/api/health");
  assert(health.ok, "/api/health responds 200", `status=${health.status}`);

  if (health.ok && health.data && typeof health.data === "object") {
    const h = health.data as Record<string, unknown>;
    assert(typeof h.status === "string", "/api/health.status is string");
    assert(typeof h.totalEntities === "number", "/api/health.totalEntities is number");
    assert(typeof h.dataMode === "string", "/api/health.dataMode is string");
    assert(h.dataMode === "mock" || h.dataMode === "database", "/api/health.dataMode is valid");
    assertGte(h.totalEntities as number, 1, "/api/health.totalEntities >= 1");
  } else {
    fail("/api/health body not parseable as object");
  }

  // ── /api/entities (all) ──────────────────────────────────────────────────────
  const all = await get("/api/entities");
  assert(all.ok, "/api/entities responds 200", `status=${all.status}`);

  if (all.ok && all.data && typeof all.data === "object") {
    const fc = all.data as Record<string, unknown>;
    assert(fc.type === "FeatureCollection", "/api/entities returns FeatureCollection");
    assert(Array.isArray(fc.features), "/api/entities.features is array");
    assertGte((fc.features as unknown[]).length, 1, "/api/entities has ≥1 feature");
  } else {
    fail("/api/entities body not parseable as GeoJSON");
  }

  // ── /api/entities?layer=pfas_sites ──────────────────────────────────────────
  const pfas = await get("/api/entities?layer=pfas_sites");
  assert(pfas.ok, "/api/entities?layer=pfas_sites responds 200");

  if (pfas.ok && pfas.data && typeof pfas.data === "object") {
    const fc = pfas.data as Record<string, unknown>;
    const features = fc.features as Array<Record<string, unknown>>;
    if (Array.isArray(features) && features.length > 0) {
      const allPfas = features.every(
        (f) => (f.properties as Record<string, unknown>)?.layerId === "pfas_sites"
      );
      assert(allPfas, "layer filter returns only pfas_sites entities");
    } else {
      warn("pfas_sites layer returned 0 features — check mock data");
    }
  }

  // ── /api/entities?bbox= (continental US) ────────────────────────────────────
  const usBox = await get("/api/entities?bbox=-125,24,-66,50");
  assert(usBox.ok, "/api/entities?bbox=<conus> responds 200");

  if (usBox.ok && usBox.data && typeof usBox.data === "object") {
    const fc = usBox.data as Record<string, unknown>;
    assert(Array.isArray((fc as Record<string, unknown>).features), "bbox filter returns FeatureCollection");
  }

  // ── /api/entities?limit=5 ───────────────────────────────────────────────────
  const limited = await get("/api/entities?limit=5");
  assert(limited.ok, "/api/entities?limit=5 responds 200");

  if (limited.ok && limited.data && typeof limited.data === "object") {
    const fc = limited.data as Record<string, unknown>;
    const count = (fc.features as unknown[])?.length ?? 0;
    assert(count <= 5, "limit param caps result set", `got ${count}`);
  }

  exitWithSummary();
}

main().catch((err) => { console.error(err); process.exit(1); });
