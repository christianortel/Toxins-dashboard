/**
 * QA: Validate browser interaction surface
 *
 * Checks that critical data/lib modules export what downstream
 * browser code expects. Runs in Node.js — does NOT import React components
 * or anything with browser-only APIs (THREE.js, window, etc).
 */
import * as atlasCache from "@/lib/data/atlas-cache";
import * as queryParams from "@/lib/data/query-params";
import * as cameraBands from "@/lib/map/camera-bands";
import * as entityPriority from "@/lib/map/entity-priority";
import * as entities from "@/data/mock/entities";
import { suite, assert, exitWithSummary } from "./_reporter";

suite("browser-interactions");

// ── Atlas cache exports ───────────────────────────────────────────────────────
assert(Array.isArray(atlasCache.NATIONAL_ATLAS), "NATIONAL_ATLAS is an array");
assert(typeof atlasCache.NATIONAL_ATLAS_COUNT === "number", "NATIONAL_ATLAS_COUNT is a number");
assert(typeof atlasCache.getAtlasValidationSummary === "function", "getAtlasValidationSummary is exported");
assert(typeof atlasCache.getAtlasScoreSummary === "function", "getAtlasScoreSummary is exported");

// ── Query params exports ──────────────────────────────────────────────────────
assert(typeof queryParams.buildEntityQueryParams === "function", "buildEntityQueryParams is exported");
assert(typeof queryParams.buildEntityUrl === "function", "buildEntityUrl is exported");
assert(typeof queryParams.BAND_QUERY_DEFAULTS === "object", "BAND_QUERY_DEFAULTS is exported");

// Smoke-test buildEntityQueryParams
const qs = queryParams.buildEntityQueryParams({ layers: ["pfas_sites"], year: 2020 });
assert(qs.get("layer") === "pfas_sites", "buildEntityQueryParams sets layer param");
assert(qs.get("year") === "2020", "buildEntityQueryParams sets year param");

// ── Camera bands exports ──────────────────────────────────────────────────────
assert(typeof cameraBands.distanceToBand === "function", "distanceToBand is exported");
assert(typeof cameraBands.isLayerEnabledForBand === "function", "isLayerEnabledForBand is exported");
assert(typeof cameraBands.NATIONAL_ATLAS_TARGETS === "object", "NATIONAL_ATLAS_TARGETS is exported");
assert(typeof cameraBands.CLICK_BEHAVIOR === "object", "CLICK_BEHAVIOR is exported");

// ── Entity priority exports ───────────────────────────────────────────────────
assert(typeof entityPriority.scoreEntity === "function", "scoreEntity is exported");
assert(typeof entityPriority.selectNationalAtlas === "function", "selectNationalAtlas is exported");
assert(typeof entityPriority.rankLocalEntities === "function", "rankLocalEntities is exported");

// ── Mock entities exports ─────────────────────────────────────────────────────
assert(Array.isArray(entities.mockEntities), "mockEntities is an array");
assert(entities.mockEntities.length > 0, "mockEntities is non-empty");
assert(typeof entities.getEntityById === "function", "getEntityById is exported");
assert(typeof entities.getEntitiesByLayer === "function", "getEntitiesByLayer is exported");
assert(typeof entities.ENTITY_COUNTS === "object", "ENTITY_COUNTS is exported");

exitWithSummary();
