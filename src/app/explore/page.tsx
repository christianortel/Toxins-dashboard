"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MapShell } from "@/components/explore/map-shell";
import { LayerControlPanel } from "@/components/explore/layer-control-panel";
import { SearchControl } from "@/components/explore/search-control";
import { TimelineShell } from "@/components/explore/timeline-shell";
import { DetailDrawer } from "@/components/explore/detail-drawer";
import { LegendShell } from "@/components/explore/legend-shell";
import { useExploreStore } from "@/stores/explore-store";

export default function ExplorePage() {
  /* Global keyboard shortcuts */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "e" || e.key === "E") {
        useExploreStore.getState().setLegendOpen(
          !useExploreStore.getState().legendOpen
        );
      }
      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          "[data-search-input]"
        );
        searchInput?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Minimal immersive top bar */}
      <div className="relative z-30 flex items-center gap-3 glass px-5 py-1.5">
        <Link
          href="/"
          className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors duration-200"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>

        <div className="h-4 w-px bg-border/40" />

        <div className="flex items-center gap-3">
          <span className="font-serif text-[11px] uppercase tracking-[0.35em] text-foreground leading-none">
            Downstream
          </span>
          <span className="text-border/40 text-[10px] select-none">/</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted leading-none">
            Explorer
          </span>
        </div>

        {/* Keyboard shortcut hints -- hidden on mobile */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <span className="text-[10px] text-text-muted/50 tracking-wide inline-flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center rounded border border-border/40 bg-surface/40 px-1.5 py-0.5 font-mono text-[9px] text-text-muted/70">
              E
            </kbd>
            <span>layers</span>
          </span>
          <span className="text-[10px] text-text-muted/50 tracking-wide inline-flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center rounded border border-border/40 bg-surface/40 px-1.5 py-0.5 font-mono text-[9px] text-text-muted/70">
              /
            </kbd>
            <span>search</span>
          </span>
        </div>

        {/* Gradient bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-water/10 to-transparent" />
      </div>

      {/* Map and overlay controls */}
      <div className="relative flex-1">
        {/* z-0: map */}
        <MapShell />
        {/* z-10: panels */}
        <LayerControlPanel />
        <SearchControl />
        <TimelineShell />
        <LegendShell />
        {/* z-20: drawer */}
        <DetailDrawer />
      </div>
    </div>
  );
}
