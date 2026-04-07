"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  FlaskConical,
  Calendar,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYER_GROUPS, EVIDENCE_LEVELS } from "@/lib/constants";
import { useExploreStore } from "@/stores/explore-store";
import { mockSites } from "@/data/mock/sites";
import type { LayerGroupId, EvidenceLevel } from "@/types";

const levelAccentMap: Record<EvidenceLevel, string> = {
  direct: "bg-accent-water",
  proxy: "bg-accent-bio",
  screening: "bg-accent-warning",
  literature: "bg-accent-contamination",
  editorial: "bg-accent-neutral",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] uppercase tracking-[0.15em] text-text-muted mb-3">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="h-px bg-border/40" />;
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

  const evidenceInfo = site ? EVIDENCE_LEVELS[site.evidenceLevel] : null;

  return (
    <AnimatePresence>
      {drawerOpen && site && (
        <motion.aside
          key="detail-drawer"
          initial={{ x: 420, opacity: 0, scaleX: 0.98 }}
          animate={{ x: 0, opacity: 1, scaleX: 1 }}
          exit={{ x: 420, opacity: 0, scaleX: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-20 w-[420px] max-w-full",
            "flex flex-col bg-panel overflow-hidden",
            "shadow-[-8px_0_32px_-8px_rgba(0,0,0,0.4)]"
          )}
          style={{
            borderLeft:
              "1px solid transparent",
            borderImage: layerGroup
              ? `linear-gradient(to bottom, ${layerGroup.color}40, var(--border-color) 40%, var(--border-color)) 1`
              : undefined,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 py-6 border-b border-border/60">
            <div className="flex-1 min-w-0 pr-4">
              {layerGroup && (
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: layerGroup.color }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.15em]"
                    style={{ color: layerGroup.color }}
                  >
                    {layerGroup.label}
                  </span>
                </div>
              )}
              <h2 className="font-serif text-xl font-light leading-tight text-foreground">
                {site.name}
              </h2>
            </div>
            <button
              onClick={() => {
                setDrawerOpen(false);
                setSelectedSite(null);
              }}
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                "bg-surface text-text-muted",
                "hover:text-foreground hover:bg-panel-hover transition-all duration-300",
                "hover:rotate-90"
              )}
              aria-label="Close detail panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-7 py-6 space-y-6">
              {/* Summary / Overview */}
              <div>
                <SectionLabel>Summary</SectionLabel>
                <p className="text-sm leading-[1.7] text-text-secondary">
                  {site.description}
                </p>
              </div>

              <Divider />

              {/* Official Signals — chemicals and facility type */}
              {site.chemicals && site.chemicals.length > 0 && (
                <>
                  <div>
                    <SectionLabel>Official Signals</SectionLabel>
                    <div className="flex items-center gap-2.5 text-sm text-text-secondary mb-3">
                      <FlaskConical className="h-3.5 w-3.5 text-text-muted" />
                      <span>{site.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {site.chemicals.map((chem) => (
                        <span
                          key={chem}
                          className={cn(
                            "inline-flex items-center rounded-md px-2.5 py-1",
                            "bg-surface/80 border-l-2 border-accent-contamination/50",
                            "text-xs font-mono text-accent-contamination"
                          )}
                        >
                          {chem}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </>
              )}

              {/* Location Context */}
              <div>
                <SectionLabel>Location Context</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                    <span>
                      {site.county}, {site.state}
                    </span>
                  </div>
                  {site.year && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                      <span>Est. {site.year}</span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[11px] font-mono text-text-muted">
                  {site.latitude.toFixed(4)}°N, {Math.abs(site.longitude).toFixed(4)}°W
                </p>
              </div>

              <Divider />

              {/* Evidence & Confidence */}
              <div>
                <SectionLabel>Evidence &amp; Confidence</SectionLabel>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "inline-block h-[5px] w-[5px] rounded-full",
                      levelAccentMap[site.evidenceLevel]
                    )}
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {evidenceInfo?.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-text-muted">
                  {evidenceInfo?.description}
                </p>
              </div>

              <Divider />

              {/* Related Sources */}
              <div>
                <SectionLabel>Related Sources</SectionLabel>
                <Link
                  href="/sources"
                  className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-water transition-colors duration-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View source registry
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <Divider />

              {/* Uncertainty Note */}
              <div className="rounded-lg bg-surface/60 border border-border/50 px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-accent-warning/70 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-[1.6] text-text-muted">
                    Proximity of industrial activity to health outcomes does not
                    establish causation. This data represents publicly available
                    records and may not reflect current site conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/60 px-7 py-4">
            <Link
              href="/methodology"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-text-muted hover:text-text-secondary transition-colors duration-300"
            >
              Data confidence framework
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
