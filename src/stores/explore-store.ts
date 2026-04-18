import { create } from "zustand";
import type { LayerGroupId, LayerId, SearchResult } from "@/types";
import { LAYERS, getLayersByGroup } from "@/data/layers";
import { type CameraBand, distanceToBand, isLayerEnabledForBand } from "@/lib/map/camera-bands";

interface ExploreState {
  // Layer group toggles
  activeGroups: Set<LayerGroupId>;

  // Fine-grained layer toggles
  activeLayers: Set<LayerId>;

  // Selected entity
  selectedEntityId: string | null;
  drawerOpen: boolean;

  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  searchOpen: boolean;

  // Timeline
  timelineYear: number;
  timelineRange: [number, number];
  timelineMode: "point" | "range";

  // Legend
  legendOpen: boolean;

  // Camera band (derived from globe camera distance)
  cameraBand: CameraBand;
  cameraDistance: number;

  // View state
  mapCenter: [number, number];
  mapZoom: number;

  // Actions
  toggleGroup: (id: LayerGroupId) => void;
  toggleLayer: (id: LayerId) => void;
  setSelectedEntity: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearchOpen: (open: boolean) => void;
  setTimelineYear: (year: number) => void;
  setTimelineRange: (range: [number, number]) => void;
  setTimelineMode: (mode: "point" | "range") => void;
  setLegendOpen: (open: boolean) => void;
  setMapView: (center: [number, number], zoom: number) => void;
  setCameraDistance: (dist: number) => void;

  // Computed-like helpers
  isLayerVisible: (layerId: LayerId) => boolean;
}

/** Default active layer IDs — layers whose groups start active. */
const DEFAULT_ACTIVE_LAYERS = new Set<LayerId>([
  "industrial_sites",
  "toxic_releases",
  "power_plants",
  "hazardous_sites",
  "pfas_sites",
  "wastewater",
]);

const DEFAULT_ACTIVE_GROUPS = new Set<LayerGroupId>(["official", "emerging"]);

export const useExploreStore = create<ExploreState>((set, get) => ({
  // --- State ---
  activeGroups: new Set(DEFAULT_ACTIVE_GROUPS),
  activeLayers: new Set(DEFAULT_ACTIVE_LAYERS),

  selectedEntityId: null,
  drawerOpen: false,

  searchQuery: "",
  searchResults: [],
  searchOpen: false,

  timelineYear: 2024,
  timelineRange: [2010, 2024],
  timelineMode: "point",

  legendOpen: true,

  cameraBand: "national" as CameraBand,
  cameraDistance: 2.5,

  mapCenter: [-98.5, 39.8] as [number, number],
  mapZoom: 4,

  // --- Actions ---

  toggleGroup: (id) =>
    set((state) => {
      const nextGroups = new Set(state.activeGroups);
      const nextLayers = new Set(state.activeLayers);
      const groupLayers = getLayersByGroup(id);

      if (nextGroups.has(id)) {
        // Deactivate group and all its layers
        nextGroups.delete(id);
        for (const layer of groupLayers) {
          nextLayers.delete(layer.id);
        }
      } else {
        // Activate group and all its layers
        nextGroups.add(id);
        for (const layer of groupLayers) {
          nextLayers.add(layer.id);
        }
      }

      return { activeGroups: nextGroups, activeLayers: nextLayers };
    }),

  toggleLayer: (id) =>
    set((state) => {
      const nextLayers = new Set(state.activeLayers);
      if (nextLayers.has(id)) {
        nextLayers.delete(id);
      } else {
        nextLayers.add(id);
      }
      return { activeLayers: nextLayers };
    }),

  setSelectedEntity: (id) =>
    set({ selectedEntityId: id, drawerOpen: id !== null }),

  setDrawerOpen: (open) => set({ drawerOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchResults: (results) => set({ searchResults: results }),

  setSearchOpen: (open) => set({ searchOpen: open }),

  setTimelineYear: (year) => set({ timelineYear: year }),

  setTimelineRange: (range) => set({ timelineRange: range }),

  setTimelineMode: (mode) => set({ timelineMode: mode }),

  setLegendOpen: (open) => set({ legendOpen: open }),

  setMapView: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),

  setCameraDistance: (dist) =>
    set({ cameraDistance: dist, cameraBand: distanceToBand(dist) }),

  // --- Computed-like helpers ---

  isLayerVisible: (layerId) => {
    const state = get();
    const layer = LAYERS[layerId];
    if (!layer) return false;
    if (!isLayerEnabledForBand(layerId, state.cameraBand)) return false;
    return state.activeGroups.has(layer.group) && state.activeLayers.has(layerId);
  },
}));
