"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MapShell } from "@/components/explore/map-shell";
import { LayerControlPanel } from "@/components/explore/layer-control-panel";
import { SearchControl } from "@/components/explore/search-control";
import { TimelineShell } from "@/components/explore/timeline-shell";
import { DetailDrawer } from "@/components/explore/detail-drawer";
import { LegendShell } from "@/components/explore/legend-shell";

export default function ExplorePage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Minimal immersive top bar */}
      <div className="flex items-center gap-4 border-b border-border bg-panel/60 backdrop-blur-md px-4 py-3 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors duration-200"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-3">
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-foreground">
            Downstream
          </span>
          <span className="text-border">|</span>
          <span className="text-[10px] uppercase tracking-widest text-text-muted">
            Explorer
          </span>
        </div>
      </div>

      {/* Map and overlay controls */}
      <div className="relative flex-1">
        <MapShell />
        <LayerControlPanel />
        <SearchControl />
        <TimelineShell />
        <DetailDrawer />
        <LegendShell />
      </div>
    </div>
  );
}
