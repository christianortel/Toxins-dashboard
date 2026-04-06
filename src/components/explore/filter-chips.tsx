"use client";

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

export function FilterChips() {
  const { activeGroups, toggleGroup } = useExploreStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1 py-1">
      {layerGroupEntries.map((group) => {
        const active = activeGroups.has(group.id);

        return (
          <button
            key={group.id}
            onClick={() => toggleGroup(group.id)}
            className={cn(
              "flex flex-shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5",
              "border text-xs font-medium transition-all duration-200",
              active
                ? "border-transparent bg-surface text-foreground shadow-sm"
                : "border-border bg-transparent text-text-muted hover:text-text-secondary hover:border-border/80"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-opacity duration-200",
                active ? "opacity-100" : "opacity-40"
              )}
              style={{ backgroundColor: group.color }}
            />
            <span className="whitespace-nowrap">{group.label}</span>
          </button>
        );
      })}
    </div>
  );
}
