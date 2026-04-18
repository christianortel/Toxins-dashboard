"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYER_GROUPS } from "@/lib/constants";
import { useExploreStore } from "@/stores/explore-store";
import { LAYERS, getLayersByGroup } from "@/data/layers";
import type { LayerGroupId } from "@/types";

const layerGroupEntries = Object.values(LAYER_GROUPS) as {
  id: LayerGroupId;
  label: string;
  description: string;
  color: string;
}[];

const BAND_LABELS: Record<string, string> = {
  national: "National",
  regional: "Regional",
  local: "Local",
};

export function LegendShell() {
  const { legendOpen, setLegendOpen, activeGroups, activeLayers, cameraBand } =
    useExploreStore();

  const activeEntries = layerGroupEntries.filter((g) =>
    activeGroups.has(g.id)
  );

  return (
    <div className="absolute bottom-20 right-4 z-10">
      <div className="rounded-xl border border-border glass overflow-hidden min-w-[220px]">
        {/* Toggle header */}
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className={cn(
            "flex w-full items-center justify-between gap-4 px-4 py-2.5",
            "text-text-secondary hover:text-foreground transition-colors duration-300"
          )}
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3 w-3 text-text-muted" />
            <span className="text-[10px] uppercase tracking-[0.12em] font-medium">
              Legend
            </span>
            <span className="rounded-full bg-accent-water/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-accent-water">
              {BAND_LABELS[cameraBand]}
            </span>
          </div>
          <motion.div
            animate={{ rotate: legendOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {legendOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-border/50 px-2 py-2 space-y-2 max-h-[60vh] overflow-y-auto">
                {activeEntries.length === 0 ? (
                  <div className="px-2 py-3 text-center">
                    <p className="text-[11px] text-text-muted/60 italic">
                      No layers active
                    </p>
                    <p className="text-[10px] text-text-muted/40 mt-1">
                      Toggle layers from the panel
                    </p>
                  </div>
                ) : (
                  activeEntries.map((group) => {
                    const groupLayers = getLayersByGroup(group.id).filter(
                      (l) => activeLayers.has(l.id)
                    );
                    return (
                      <div key={group.id}>
                        <div className="flex items-center gap-2.5 px-2.5 py-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full flex-shrink-0 ring-1 ring-white/10"
                            style={{ backgroundColor: group.color }}
                          />
                          <span
                            className="text-[10px] uppercase tracking-wider font-medium"
                            style={{ color: group.color }}
                          >
                            {group.label}
                          </span>
                        </div>
                        {groupLayers.length > 0 && (
                          <ul className="ml-5 border-l border-border/30 pl-3 space-y-0.5 mb-1">
                            {groupLayers.map((layer) => (
                              <li
                                key={layer.id}
                                className="flex items-center justify-between gap-2 py-0.5"
                              >
                                <span className="text-[10px] text-text-secondary truncate">
                                  {layer.label}
                                </span>
                                <span className="text-[9px] tabular-nums text-text-muted flex-shrink-0">
                                  {LAYERS[layer.id].entityCount}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {/* Evidence levels footer */}
              <div className="border-t border-border/40 px-3 py-2">
                <p className="text-[9px] uppercase tracking-wider text-text-muted/60 mb-1.5">
                  Evidence Levels
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-accent-water" />
                    <span className="text-[9px] text-text-muted">Direct</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-accent-bio" />
                    <span className="text-[9px] text-text-muted">Proxy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-accent-warning" />
                    <span className="text-[9px] text-text-muted">Screen</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-accent-contamination" />
                    <span className="text-[9px] text-text-muted">Lit.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
