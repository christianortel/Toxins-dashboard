import { create } from "zustand";
import type { LayerGroupId, DataLayer } from "@/types";

interface ExploreState {
  activeGroups: Set<LayerGroupId>;
  activeLayers: DataLayer[];
  selectedSiteId: string | null;
  drawerOpen: boolean;
  searchQuery: string;
  timelineYear: number;
  legendOpen: boolean;

  toggleGroup: (id: LayerGroupId) => void;
  setSelectedSite: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTimelineYear: (year: number) => void;
  setLegendOpen: (open: boolean) => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  activeGroups: new Set<LayerGroupId>(["official", "emerging"]),
  activeLayers: [],
  selectedSiteId: null,
  drawerOpen: false,
  searchQuery: "",
  timelineYear: 2024,
  legendOpen: true,

  toggleGroup: (id) =>
    set((state) => {
      const next = new Set(state.activeGroups);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { activeGroups: next };
    }),

  setSelectedSite: (id) => set({ selectedSiteId: id, drawerOpen: id !== null }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimelineYear: (year) => set({ timelineYear: year }),
  setLegendOpen: (open) => set({ legendOpen: open }),
}));
