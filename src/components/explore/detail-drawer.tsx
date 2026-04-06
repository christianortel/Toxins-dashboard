"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, FlaskConical, Shield, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYER_GROUPS, EVIDENCE_LEVELS } from "@/lib/constants";
import { useExploreStore } from "@/stores/explore-store";
import { mockSites } from "@/data/mock/sites";
import type { LayerGroupId, EvidenceLevel } from "@/types";

function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const info = EVIDENCE_LEVELS[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "bg-surface border border-border text-[11px] font-medium text-text-secondary"
      )}
    >
      <Shield className="h-3 w-3" />
      {info.label}
    </span>
  );
}

export function DetailDrawer() {
  const { drawerOpen, setDrawerOpen, selectedSiteId, setSelectedSite } =
    useExploreStore();

  const site = selectedSiteId
    ? mockSites.find((s) => s.id === selectedSiteId)
    : null;

  const layerGroup = site
    ? LAYER_GROUPS[site.layerGroup as LayerGroupId]
    : null;

  return (
    <AnimatePresence>
      {drawerOpen && site && (
        <motion.aside
          key="detail-drawer"
          initial={{ x: 384, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 384, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-20 w-96 max-w-full",
            "flex flex-col border-l border-border bg-panel",
            "overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div className="flex-1 min-w-0 pr-4">
              {layerGroup && (
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: layerGroup.color }}
                  />
                  <span className="text-[10px] uppercase tracking-widest text-text-muted">
                    {layerGroup.label}
                  </span>
                </div>
              )}
              <h2 className="text-lg font-semibold leading-tight text-foreground">
                {site.name}
              </h2>
            </div>
            <button
              onClick={() => {
                setDrawerOpen(false);
                setSelectedSite(null);
              }}
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md",
                "text-text-muted hover:text-foreground hover:bg-surface transition-colors"
              )}
              aria-label="Close detail panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Meta info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <FlaskConical className="h-3.5 w-3.5 text-text-muted" />
                <span>{site.type}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <MapPin className="h-3.5 w-3.5 text-text-muted" />
                <span>
                  {site.county}, {site.state}
                </span>
              </div>
              {site.year && (
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Calendar className="h-3.5 w-3.5 text-text-muted" />
                  <span>Established {site.year}</span>
                </div>
              )}
            </div>

            {/* Evidence level */}
            <div>
              <EvidenceBadge level={site.evidenceLevel} />
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-[10px] uppercase tracking-widest text-text-muted">
                Overview
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {site.description}
              </p>
            </div>

            {/* Chemicals */}
            {site.chemicals && site.chemicals.length > 0 && (
              <div>
                <h3 className="mb-2.5 text-[10px] uppercase tracking-widest text-text-muted">
                  Associated Chemicals
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {site.chemicals.map((chem) => (
                    <span
                      key={chem}
                      className={cn(
                        "inline-flex items-center rounded-md px-2.5 py-1",
                        "bg-surface border border-border",
                        "text-xs font-mono text-accent-contamination"
                      )}
                    >
                      {chem}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinates */}
            <div>
              <h3 className="mb-2 text-[10px] uppercase tracking-widest text-text-muted">
                Coordinates
              </h3>
              <p className="text-xs font-mono text-text-muted">
                {site.latitude.toFixed(4)}N, {Math.abs(site.longitude).toFixed(4)}W
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-6 py-4">
            <p className="text-[10px] leading-relaxed text-text-muted">
              Data sourced from public records. See{" "}
              <span className="underline underline-offset-2 cursor-pointer hover:text-text-secondary transition-colors">
                methodology
              </span>{" "}
              for data confidence framework.
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
