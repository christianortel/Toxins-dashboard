"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYER_GROUPS, EVIDENCE_LEVELS } from "@/lib/constants";
import { useExploreStore } from "@/stores/explore-store";
import type { LayerGroupId } from "@/types";

const layerGroupEntries = Object.values(LAYER_GROUPS) as {
  id: LayerGroupId;
  label: string;
  description: string;
  color: string;
}[];

export function LegendShell() {
  const { legendOpen, setLegendOpen, activeGroups } = useExploreStore();

  const activeEntries = layerGroupEntries.filter((g) =>
    activeGroups.has(g.id)
  );

  return (
    <div className="absolute bottom-20 right-4 z-10">
      <div className="rounded-xl border border-border glass overflow-hidden min-w-[180px]">
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
              <div className="border-t border-border/50 px-2 py-2 space-y-0.5">
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
                  activeEntries.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-surface/30 transition-colors duration-200"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0 ring-1 ring-white/10"
                        style={{ backgroundColor: group.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-text-secondary block leading-tight">
                          {group.label}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
