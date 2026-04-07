"use client";

import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mockSites } from "@/data/mock/sites";
import { useExploreStore } from "@/stores/explore-store";

const LAYER_GROUP_COLORS: Record<string, string> = {
  wildlife: "#6b8f71",
  official: "#c4784a",
  emerging: "#b5924a",
  reproductive: "#7a9eb5",
  regulatory: "#8a8a96",
};

/* Slightly brighter stroke variants */
const LAYER_GROUP_STROKES: Record<string, string> = {
  wildlife: "#8ab391",
  official: "#d99468",
  emerging: "#ccaa66",
  reproductive: "#96bdd4",
  regulatory: "#a4a4b0",
};

function buildGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: mockSites.map((site, idx) => ({
      type: "Feature",
      id: idx,
      geometry: {
        type: "Point",
        coordinates: [site.longitude, site.latitude],
      },
      properties: {
        id: site.id,
        name: site.name,
        type: site.type,
        layerGroup: site.layerGroup,
        evidenceLevel: site.evidenceLevel,
      },
    })),
  };
}

export function MapShell() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

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
      /* Add sites GeoJSON source */
      map.addSource("sites", {
        type: "geojson",
        data: buildGeoJSON(),
      });

      /* Build match expressions for fill and stroke */
      const groups = Object.keys(LAYER_GROUP_COLORS);
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

      /* Circle layer */
      map.addLayer({
        id: "sites-circles",
        type: "circle",
        source: "sites",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            9,
            6,
          ],
          "circle-color": fillMatch as any,
          "circle-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.8,
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": strokeMatch as any,
        },
      });

      /* Hover interaction */
      let hoveredId: string | number | null = null;

      map.on("mouseenter", "sites-circles", (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (e.features && e.features[0]) {
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: "sites", id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = e.features[0].id ?? null;
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: "sites", id: hoveredId },
              { hover: true }
            );
          }
        }
      });

      map.on("mouseleave", "sites-circles", () => {
        map.getCanvas().style.cursor = "";
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "sites", id: hoveredId },
            { hover: false }
          );
        }
        hoveredId = null;
      });

      /* Click to select site */
      map.on("click", "sites-circles", (e) => {
        if (e.features && e.features[0]) {
          const siteId = e.features[0].properties?.id;
          if (siteId) {
            useExploreStore.getState().setSelectedSite(siteId);
          }
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
    </div>
  );
}
