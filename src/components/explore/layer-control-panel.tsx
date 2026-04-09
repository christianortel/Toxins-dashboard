"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronLeft, ChevronDown } from "lucide-react";
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

export function LayerControlPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<LayerGroupId>>(
    new Set()
  );
  const { activeGroups, activeLayers, toggleGroup, toggleLayer } =
    useExploreStore();

  const totalActive = activeLayers.size;
  const totalLayers = Object.keys(LAYERS).length;
  const allActive = totalActive === totalLayers;

  function toggleExpanded(id: LayerGroupId) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      {/* Mobile / collapsed toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={cn(
          "absolute left-4 top-4 z-10 flex items-center gap-2",
          "rounded-full border border-border glass",
          "px-4 py-2.5",
          "text-text-secondary hover:text-foreground transition-colors",
          !collapsed && "md:hidden"
        )}
        aria-label={collapsed ? "Show data layers" : "Hide data layers"}
      >
        <Layers className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium tracking-wide">Layers</span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.aside
            initial={{ x: -288, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -288, opacity: 0.5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute left-4 top-4 bottom-4 z-10 w-72",
              "flex flex-col overflow-hidden",
              "rounded-xl border border-border glass"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4 text-text-secondary" />
                <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                  Data Layers
                </h2>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:text-foreground hover:bg-surface transition-colors"
                aria-label="Collapse panel"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Layer groups */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {layerGroupEntries.map((group, i) => {
                const groupActive = activeGroups.has(group.id);
                const groupLayers = getLayersByGroup(group.id);
                const expanded = expandedGroups.has(group.id);
                const groupActiveCount = groupLayers.filter((l) =>
                  activeLayers.has(l.id)
                ).length;

                return (
                  <div key={group.id}>
                    {/* Group row */}
                    <div className="flex items-stretch">
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          "group flex flex-1 items-start gap-3.5 rounded-lg px-3 py-3 text-left transition-colors",
                          groupActive ? "bg-surface/80" : "hover:bg-surface/40"
                        )}
                      >
                        {/* Toggle switch */}
                        <div className="mt-0.5 flex-shrink-0">
                          <div
                            className={cn(
                              "relative h-[22px] w-10 rounded-full transition-colors duration-300",
                              groupActive ? "bg-surface" : "bg-border"
                            )}
                          >
                            <div
                              className={cn(
                                "absolute top-[3px] h-4 w-4 rounded-full transition-all duration-300 ease-out",
                                groupActive ? "left-[21px]" : "left-[3px]"
                              )}
                              style={{
                                backgroundColor: groupActive
                                  ? group.color
                                  : "var(--text-muted)",
                                boxShadow: groupActive
                                  ? "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)"
                                  : "0 1px 2px rgba(0,0,0,0.3)",
                              }}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium transition-colors",
                                groupActive
                                  ? "text-foreground"
                                  : "text-text-secondary"
                              )}
                            >
                              {group.label}
                            </span>
                            <span className="text-[10px] tabular-nums text-text-muted/70 flex-shrink-0">
                              {groupActiveCount}/{groupLayers.length}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-text-secondary/70">
                            {group.description}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => toggleExpanded(group.id)}
                        className="px-2 text-text-muted hover:text-foreground transition-colors"
                        aria-label={
                          expanded ? "Collapse layers" : "Expand layers"
                        }
                      >
                        <motion.div
                          animate={{ rotate: expanded ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </motion.div>
                      </button>
                    </div>

                    {/* Sub-layers */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="ml-12 mr-3 mb-2 space-y-0.5 border-l border-border/40 pl-3">
                            {groupLayers.map((layer) => {
                              const layerActive = activeLayers.has(layer.id);
                              return (
                                <button
                                  key={layer.id}
                                  onClick={() => toggleLayer(layer.id)}
                                  disabled={!groupActive}
                                  className={cn(
                                    "group flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition-colors",
                                    !groupActive && "opacity-40 cursor-not-allowed",
                                    groupActive && "hover:bg-surface/40"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-full transition-all flex-shrink-0",
                                      layerActive
                                        ? "ring-1 ring-white/20"
                                        : "opacity-30"
                                    )}
                                    style={{
                                      backgroundColor: layerActive
                                        ? group.color
                                        : "var(--text-muted)",
                                    }}
                                  />
                                  <span
                                    className={cn(
                                      "flex-1 text-[11px] truncate",
                                      layerActive
                                        ? "text-text-secondary"
                                        : "text-text-muted/60"
                                    )}
                                  >
                                    {layer.label}
                                  </span>
                                  <span className="text-[9px] tabular-nums text-text-muted/50 flex-shrink-0">
                                    {layer.entityCount}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Separator between groups */}
                    {i < layerGroupEntries.length - 1 && (
                      <div className="h-px bg-border/50 mx-3 my-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3">
              <p
                className={cn(
                  "text-[10px] uppercase tracking-widest text-text-muted transition-colors",
                  allActive && "text-accent-water"
                )}
              >
                {allActive ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-water opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-water" />
                    </span>
                    All layers active
                  </span>
                ) : (
                  <span>
                    {totalActive} of {totalLayers} layers active
                  </span>
                )}
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
