"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useExploreStore } from "@/stores/explore-store";

export function SearchControl() {
  const { searchQuery, setSearchQuery } = useExploreStore();
  const inputRef = useRef<HTMLInputElement>(null);

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
          "group/search flex items-center gap-2.5 rounded-xl border border-border",
          "glass px-4 py-3",
          "focus-within:border-accent-water/30 transition-all duration-300",
          "focus-within:shadow-[0_0_0_3px_rgba(122,158,181,0.08)]"
        )}
      >
        <Search
          className={cn(
            "h-4 w-4 flex-shrink-0 transition-colors duration-200",
            "text-text-muted group-focus-within/search:text-accent-water"
          )}
        />
        <input
          ref={inputRef}
          data-search-input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations, chemicals, facilities..."
          className={cn(
            "flex-1 bg-transparent text-[13px] text-foreground",
            "placeholder:text-text-muted",
            "outline-none"
          )}
        />

        {/* "/" shortcut hint when empty */}
        {!searchQuery && (
          <span className="hidden md:flex items-center gap-1.5 text-text-muted/50 select-none">
            <kbd className="inline-flex items-center justify-center rounded border border-border/50 bg-surface/50 px-1.5 py-0.5 font-mono text-[9px] text-text-muted/60">
              /
            </kbd>
          </span>
        )}

        {/* Clear button with scale transition */}
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="flex-shrink-0 rounded-md p-1 text-text-muted hover:text-foreground hover:bg-surface/60 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
