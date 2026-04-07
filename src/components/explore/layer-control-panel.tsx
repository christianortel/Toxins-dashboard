"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronLeft } from "lucide-react";
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

  const allActive = activeGroups.size === layerGroupEntries.length;

  return (
    <>
      {/* Mobile / collapsed toggle -- styled as floating pill */}
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
                const active = activeGroups.has(group.id);

                return (
                  <div key={group.id}>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={cn(
                        "group flex w-full items-start gap-3.5 rounded-lg px-3 py-3 text-left transition-colors",
                        active ? "bg-surface/80" : "hover:bg-surface/40"
                      )}
                    >
                      {/* Toggle switch */}
                      <div className="mt-0.5 flex-shrink-0">
                        <div
                          className={cn(
                            "relative h-[22px] w-10 rounded-full transition-colors duration-300",
                            active ? "bg-surface" : "bg-border"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-[3px] h-4 w-4 rounded-full transition-all duration-300 ease-out",
                              active ? "left-[21px]" : "left-[3px]"
                            )}
                            style={{
                              backgroundColor: active
                                ? group.color
                                : "var(--text-muted)",
                              boxShadow: active
                                ? "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)"
                                : "0 1px 2px rgba(0,0,0,0.3)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            active ? "text-foreground" : "text-text-secondary"
                          )}
                        >
                          {group.label}
                        </span>
                        <p className="mt-1 text-xs leading-relaxed text-text-secondary/70">
                          {group.description}
                        </p>
                      </div>
                    </button>

                    {/* Separator between groups */}
                    {i < layerGroupEntries.length - 1 && (
                      <div className="h-px bg-border/50 mx-3" />
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
                    {activeGroups.size} of {layerGroupEntries.length} active
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
