"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, MapPin, FileText, Beaker } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useExploreStore } from "@/stores/explore-store";
import { mockEntities } from "@/data/mock/entities";
import { mockCaseStudies } from "@/data/mock/case-studies";
import { LAYER_GROUPS } from "@/lib/constants";
import type { SearchResult } from "@/types";

const MAX_RESULTS = 8;

function buildSearchIndex(): SearchResult[] {
  const entityResults: SearchResult[] = mockEntities.map((e) => ({
    id: `entity:${e.id}`,
    label: e.name,
    sublabel: `${e.county}, ${e.state}`,
    type: "entity",
    layerGroup: e.layerGroup,
    coordinates: [e.longitude, e.latitude],
    entityId: e.id,
  }));

  const caseStudyResults: SearchResult[] = mockCaseStudies.map((cs) => ({
    id: `case:${cs.slug}`,
    label: cs.title,
    sublabel: cs.location,
    type: "case_study",
    layerGroup: cs.layerGroups[0],
    coordinates: cs.coordinates,
  }));

  return [...entityResults, ...caseStudyResults];
}

function scoreMatch(result: SearchResult, query: string): number {
  const q = query.toLowerCase();
  const label = result.label.toLowerCase();
  const sub = result.sublabel.toLowerCase();

  if (label === q) return 1000;
  if (label.startsWith(q)) return 500;
  if (label.includes(q)) return 200;
  if (sub.includes(q)) return 80;

  // Fuzzy: check if entity tags or chemicals match
  if (result.type === "entity" && result.entityId) {
    const e = mockEntities.find((x) => x.id === result.entityId);
    if (e) {
      const tagHit = e.tags.some((t) => t.toLowerCase().includes(q));
      if (tagHit) return 60;
      // chemicals/contaminants in meta
      const meta = e.meta as Record<string, unknown>;
      const arrayKeys = ["chemicals", "contaminants", "pfasCompounds", "associatedContaminants"];
      for (const key of arrayKeys) {
        const v = meta[key];
        if (Array.isArray(v) && v.some((c: unknown) =>
          typeof c === "string" && c.toLowerCase().includes(q)
        )) {
          return 50;
        }
      }
    }
  }

  return 0;
}

export function SearchControl() {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedEntity,
    searchOpen,
    setSearchOpen,
  } = useExploreStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  // Track the query that activeIdx is aligned with so we can reset during
  // render when the query changes — avoids a cascading effect-based reset.
  const [trackedQuery, setTrackedQuery] = useState(searchQuery);
  if (searchQuery !== trackedQuery) {
    setTrackedQuery(searchQuery);
    setActiveIdx(0);
  }

  // Build the search index once
  const index = useMemo(() => buildSearchIndex(), []);

  // Compute results based on query
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [] as SearchResult[];
    const scored = index
      .map((r) => ({ r, score: scoreMatch(r, searchQuery.trim()) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((x) => x.r);
    return scored;
  }, [searchQuery, index]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen, setSearchOpen]);

  function handleSelect(result: SearchResult) {
    if (result.type === "entity" && result.entityId) {
      setSelectedEntity(result.entityId);
    } else if (result.type === "case_study") {
      // Could navigate; here we just close
      window.location.href = `/case-studies/${result.id.replace("case:", "")}`;
      return;
    }
    setSearchQuery("");
    setSearchOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setSearchOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div
      ref={containerRef}
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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search facilities, chemicals, locations..."
          className={cn(
            "flex-1 bg-transparent text-[13px] text-foreground",
            "placeholder:text-text-muted",
            "outline-none"
          )}
        />

        {!searchQuery && (
          <span className="hidden md:flex items-center gap-1.5 text-text-muted/50 select-none">
            <kbd className="inline-flex items-center justify-center rounded border border-border/50 bg-surface/50 px-1.5 py-0.5 font-mono text-[9px] text-text-muted/60">
              /
            </kbd>
          </span>
        )}

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

      {/* Results dropdown */}
      <AnimatePresence>
        {searchOpen && searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-2 rounded-xl border border-border glass overflow-hidden",
              "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
            )}
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-text-muted">
                  No matches for{" "}
                  <span className="text-foreground italic">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </p>
                <p className="mt-1 text-[10px] text-text-muted/60">
                  Try a chemical name, facility, or place
                </p>
              </div>
            ) : (
              <ul className="py-1.5 max-h-[60vh] overflow-y-auto">
                {results.map((r, i) => {
                  const Icon =
                    r.type === "case_study"
                      ? FileText
                      : r.type === "location"
                      ? MapPin
                      : Beaker;
                  const groupColor = r.layerGroup
                    ? LAYER_GROUPS[r.layerGroup].color
                    : "var(--text-muted)";
                  return (
                    <li key={r.id}>
                      <button
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => handleSelect(r)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          activeIdx === i
                            ? "bg-surface/80"
                            : "hover:bg-surface/40"
                        )}
                      >
                        <span
                          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: groupColor }}
                        />
                        <Icon className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] text-foreground truncate">
                            {r.label}
                          </div>
                          <div className="text-[10px] text-text-muted truncate">
                            {r.sublabel}
                          </div>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-text-muted/60 flex-shrink-0">
                          {r.type === "case_study" ? "Case" : "Site"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="border-t border-border/40 px-3 py-1.5 flex items-center justify-between text-[9px] text-text-muted/60">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border/40 bg-surface/40 px-1 py-px font-mono">
                  ↑↓
                </kbd>{" "}
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border/40 bg-surface/40 px-1 py-px font-mono">
                  ↵
                </kbd>{" "}
                select
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border/40 bg-surface/40 px-1 py-px font-mono">
                  esc
                </kbd>{" "}
                close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
