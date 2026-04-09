"use client";

import { useRef, useEffect, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mockEntities } from "@/data/mock/entities";
import { useExploreStore } from "@/stores/explore-store";
import type { AnyMapEntity, LayerGroupId, LayerId } from "@/types";

const LAYER_GROUP_COLORS: Record<LayerGroupId, string> = {
  wildlife: "#6b8f71",
  official: "#c4784a",
  emerging: "#b5924a",
  reproductive: "#7a9eb5",
  regulatory: "#8a8a96",
};

/* Slightly brighter stroke variants */
const LAYER_GROUP_STROKES: Record<LayerGroupId, string> = {
  wildlife: "#8ab391",
  official: "#d99468",
  emerging: "#ccaa66",
  reproductive: "#96bdd4",
  regulatory: "#a4a4b0",
};

function buildGeoJSON(entities: AnyMapEntity[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: entities.map((entity, idx) => ({
      type: "Feature",
      id: idx,
      geometry: {
        type: "Point",
        coordinates: [entity.longitude, entity.latitude],
      },
      properties: {
        id: entity.id,
        name: entity.name,
        layerId: entity.layerId,
        layerGroup: entity.layerGroup,
        evidenceLevel: entity.evidenceLevel,
        year: entity.year ?? null,
        yearEnd: entity.yearEnd ?? null,
      },
    })),
  };
}

export function MapShell() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const activeLayers = useExploreStore((s) => s.activeLayers);
  const activeGroups = useExploreStore((s) => s.activeGroups);
  const timelineYear = useExploreStore((s) => s.timelineYear);

  /** Filter entities by active layers and timeline year. */
  const visibleEntities = useMemo(() => {
    return mockEntities.filter((e) => {
      // Layer visibility
      if (!activeGroups.has(e.layerGroup)) return false;
      if (!activeLayers.has(e.layerId)) return false;

      // Timeline visibility
      if (e.year !== undefined) {
        const start = e.year;
        const end = e.yearEnd ?? 2030;
        if (timelineYear < start || timelineYear > end) return false;
      }
      return true;
    });
  }, [activeLayers, activeGroups, timelineYear]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style:
        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-98, 39],
      zoom: 4,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      "top-right"
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.on("load", () => {
      /* Add entities GeoJSON source */
      map.addSource("entities", {
        type: "geojson",
        data: buildGeoJSON(visibleEntities),
      });

      /* Build match expressions for fill and stroke */
      const groups = Object.keys(LAYER_GROUP_COLORS) as LayerGroupId[];
      const fillMatch: (string | string[])[] = ["match", ["get", "layerGroup"]];
      const strokeMatch: (string | string[])[] = [
        "match",
        ["get", "layerGroup"],
      ];

      groups.forEach((g) => {
        fillMatch.push(g, LAYER_GROUP_COLORS[g]);
        strokeMatch.push(g, LAYER_GROUP_STROKES[g]);
      });
      fillMatch.push("#8a8a96"); // fallback
      strokeMatch.push("#a4a4b0"); // fallback

      /* Glow halo (under main circle) */
      map.addLayer({
        id: "entities-glow",
        type: "circle",
        source: "entities",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            18,
            13,
          ],
          "circle-color": fillMatch as never,
          "circle-opacity": 0.12,
          "circle-blur": 0.6,
        },
      });

      /* Main circle layer */
      map.addLayer({
        id: "entities-circles",
        type: "circle",
        source: "entities",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            9,
            6,
          ],
          "circle-color": fillMatch as never,
          "circle-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.85,
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": strokeMatch as never,
        },
      });

      /* Hover interaction */
      let hoveredId: string | number | null = null;

      map.on("mousemove", "entities-circles", (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (e.features && e.features[0]) {
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: "entities", id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = e.features[0].id ?? null;
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: "entities", id: hoveredId },
              { hover: true }
            );
          }
        }
      });

      map.on("mouseleave", "entities-circles", () => {
        map.getCanvas().style.cursor = "";
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "entities", id: hoveredId },
            { hover: false }
          );
        }
        hoveredId = null;
      });

      /* Click to select entity */
      map.on("click", "entities-circles", (e) => {
        if (e.features && e.features[0]) {
          const entityId = e.features[0].properties?.id;
          if (entityId) {
            useExploreStore.getState().setSelectedEntity(entityId);
          }
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update source data when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateData = () => {
      const source = map.getSource("entities") as
        | maplibregl.GeoJSONSource
        | undefined;
      if (source) {
        source.setData(buildGeoJSON(visibleEntities));
      }
    };

    if (map.isStyleLoaded()) {
      updateData();
    } else {
      map.once("load", updateData);
    }
  }, [visibleEntities]);

  return (
    <div className="relative h-full w-full z-0">
      <div ref={containerRef} className="absolute inset-0" />
      {/* Cinematic vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 120px 40px rgba(10,10,11,0.5)",
        }}
      />
      {/* Entity count display - bottom left */}
      <div className="pointer-events-none absolute left-4 bottom-20 z-10">
        <div className="rounded-md glass border border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-text-muted">
          <span className="text-foreground tabular-nums">
            {visibleEntities.length}
          </span>{" "}
          / {mockEntities.length} entities visible
        </div>
      </div>
    </div>
  );
}

// Mark unused but keep for potential cluster expansion
export type { LayerId };
