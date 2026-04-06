"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";
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

export function LayerControlPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const { activeGroups, toggleGroup } = useExploreStore();

  return (
    <>
      {/* Mobile / collapsed toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={cn(
          "absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center",
          "rounded-lg border border-border bg-panel/95 backdrop-blur-md",
          "text-text-secondary hover:text-foreground transition-colors",
          !collapsed && "md:hidden"
        )}
        aria-label={collapsed ? "Show data layers" : "Hide data layers"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.aside
            initial={{ x: -288, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -288, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute left-4 top-4 bottom-4 z-10 w-72",
              "flex flex-col overflow-hidden",
              "rounded-lg border border-border bg-panel/95 backdrop-blur-md"
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
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {layerGroupEntries.map((group) => {
                const active = activeGroups.has(group.id);

                return (
                  <button
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "group flex w-full items-start gap-3.5 rounded-md px-3 py-3 text-left transition-colors",
                      active
                        ? "bg-surface/80"
                        : "hover:bg-surface/40"
                    )}
                  >
                    {/* Toggle switch */}
                    <div className="mt-0.5 flex-shrink-0">
                      <div
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors duration-200",
                          active ? "bg-surface" : "bg-border"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full transition-all duration-200 shadow-sm",
                            active ? "left-[18px]" : "left-0.5"
                          )}
                          style={{
                            backgroundColor: active
                              ? group.color
                              : "var(--text-muted)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: group.color }}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            active
                              ? "text-foreground"
                              : "text-text-secondary"
                          )}
                        >
                          {group.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-text-muted pl-4">
                        {group.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-text-muted">
                {activeGroups.size} of {layerGroupEntries.length} active
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
