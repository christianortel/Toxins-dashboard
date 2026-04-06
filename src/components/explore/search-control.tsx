"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExploreStore } from "@/stores/explore-store";

export function SearchControl() {
  const { searchQuery, setSearchQuery } = useExploreStore();

  return (
    <div
      className={cn(
        "absolute top-4 z-10",
        "left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:left-80",
        "w-80 max-w-[calc(100vw-6rem)]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border border-border",
          "bg-panel/90 backdrop-blur-md px-3.5 py-2.5",
          "focus-within:border-accent-water/40 transition-colors"
        )}
      >
        <Search className="h-4 w-4 flex-shrink-0 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations, chemicals, facilities..."
          className={cn(
            "flex-1 bg-transparent text-sm text-foreground",
            "placeholder:text-text-muted",
            "outline-none"
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="flex-shrink-0 rounded-md p-0.5 text-text-muted hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
