"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYER_GROUPS } from "@/lib/constants";
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
      <div
        className={cn(
          "rounded-lg border border-border bg-panel/90 backdrop-blur-md",
          "overflow-hidden transition-all"
        )}
      >
        {/* Toggle header */}
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className={cn(
            "flex w-full items-center justify-between gap-3 px-4 py-2.5",
            "text-text-secondary hover:text-foreground transition-colors"
          )}
        >
          <div className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-[10px] uppercase tracking-widest font-medium">
              Legend
            </span>
          </div>
          {legendOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </button>

        {/* Content */}
        <AnimatePresence>
          {legendOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-4 py-3 space-y-2">
                {activeEntries.length === 0 ? (
                  <p className="text-xs text-text-muted italic">
                    No active layers
                  </p>
                ) : (
                  activeEntries.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-2.5"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-xs text-text-secondary">
                        {group.label}
                      </span>
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
