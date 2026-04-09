"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Tag,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYER_GROUPS, EVIDENCE_LEVELS } from "@/lib/constants";
import { useExploreStore } from "@/stores/explore-store";
import { getEntityById } from "@/data/mock/entities";
import { LAYERS } from "@/data/layers";
import { mockSources } from "@/data/mock/sources";
import type {
  AnyMapEntity,
  EvidenceLevel,
  IndustrialSite,
  PowerPlant,
  PfasSite,
  HazardousSite,
  WastewaterSite,
  SentinelRecord,
  ReproductiveRegion,
  CaseStudyMarker,
  LegalAction,
} from "@/types";

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

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-border/20 last:border-b-0">
      <span className="text-[11px] uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <span className="text-xs text-text-secondary text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}

function ChemChip({ chem }: { chem: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1",
        "bg-surface/80 border-l-2 border-accent-contamination/50",
        "text-xs font-mono text-accent-contamination"
      )}
    >
      {chem}
    </span>
  );
}

function fmtUSD(n: number | undefined): string {
  if (n === undefined) return "—";
  if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  return "$" + n.toLocaleString();
}

/** Render layer-specific signal data based on entity type. */
function LayerSpecificDetails({ entity }: { entity: AnyMapEntity }) {
  switch (entity.layerId) {
    case "industrial_sites": {
      const e = entity as IndustrialSite;
      return (
        <div>
          <SectionLabel>Facility Signals</SectionLabel>
          <div className="space-y-1 mb-4">
            <MetaRow label="Type" value={e.meta.facilityType} />
            <MetaRow label="Status" value={e.meta.operatingStatus} />
            {e.meta.parentCompany && (
              <MetaRow label="Operator" value={e.meta.parentCompany} />
            )}
            {e.meta.triId && (
              <MetaRow
                label="TRI ID"
                value={<span className="font-mono">{e.meta.triId}</span>}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {e.meta.chemicals.map((c) => (
              <ChemChip key={c} chem={c} />
            ))}
          </div>
        </div>
      );
    }
    case "power_plants": {
      const e = entity as PowerPlant;
      return (
        <div>
          <SectionLabel>Generation &amp; Emissions</SectionLabel>
          <div className="space-y-1">
            <MetaRow label="Fuel Type" value={e.meta.fuelType} />
            <MetaRow
              label="Capacity"
              value={`${e.meta.capacityMw.toLocaleString()} MW`}
            />
            {e.meta.emissionsCo2Tons !== undefined &&
              e.meta.emissionsCo2Tons > 0 && (
                <MetaRow
                  label="CO₂ / yr"
                  value={`${(e.meta.emissionsCo2Tons / 1_000_000).toFixed(1)}M tons`}
                />
              )}
            {e.meta.emissionsSo2Tons !== undefined &&
              e.meta.emissionsSo2Tons > 0 && (
                <MetaRow
                  label="SO₂ / yr"
                  value={`${e.meta.emissionsSo2Tons.toLocaleString()} tons`}
                />
              )}
            {e.meta.emissionsNoxTons !== undefined &&
              e.meta.emissionsNoxTons > 0 && (
                <MetaRow
                  label="NOₓ / yr"
                  value={`${e.meta.emissionsNoxTons.toLocaleString()} tons`}
                />
              )}
            <MetaRow label="Status" value={e.meta.operatingStatus} />
          </div>
        </div>
      );
    }
    case "pfas_sites": {
      const e = entity as PfasSite;
      return (
        <div>
          <SectionLabel>PFAS Detection</SectionLabel>
          <div className="space-y-1 mb-4">
            <MetaRow label="Site Type" value={e.meta.siteType} />
            <MetaRow label="Medium" value={e.meta.mediumTested} />
            {e.meta.maxConcentrationPpt !== undefined && (
              <MetaRow
                label="Peak"
                value={`${e.meta.maxConcentrationPpt.toLocaleString()} ppt`}
              />
            )}
            {e.meta.affectedPopulation !== undefined && (
              <MetaRow
                label="Population"
                value={`~${e.meta.affectedPopulation.toLocaleString()}`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {e.meta.pfasCompounds.map((c) => (
              <ChemChip key={c} chem={c} />
            ))}
          </div>
        </div>
      );
    }
    case "hazardous_sites": {
      const e = entity as HazardousSite;
      return (
        <div>
          <SectionLabel>Hazard Profile</SectionLabel>
          <div className="space-y-1 mb-4">
            <MetaRow label="Site Type" value={e.meta.siteType} />
            {e.meta.nplStatus && (
              <MetaRow label="NPL Status" value={e.meta.nplStatus} />
            )}
            <MetaRow label="Cleanup" value={e.meta.cleanupStatus} />
            {e.meta.hazardScore !== undefined && (
              <MetaRow label="HRS Score" value={e.meta.hazardScore.toFixed(2)} />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {e.meta.contaminants.map((c) => (
              <ChemChip key={c} chem={c} />
            ))}
          </div>
        </div>
      );
    }
    case "wastewater": {
      const e = entity as WastewaterSite;
      return (
        <div>
          <SectionLabel>Discharge Profile</SectionLabel>
          <div className="space-y-1">
            <MetaRow label="Type" value={e.meta.facilityType} />
            <MetaRow label="Receiving" value={e.meta.receivingWater} />
            {e.meta.designFlowMgd !== undefined && (
              <MetaRow
                label="Design Flow"
                value={`${e.meta.designFlowMgd.toLocaleString()} MGD`}
              />
            )}
            <MetaRow
              label="Violations"
              value={e.meta.violationsCount.toString()}
            />
            {e.meta.npdesPermit && (
              <MetaRow
                label="NPDES"
                value={<span className="font-mono">{e.meta.npdesPermit}</span>}
              />
            )}
          </div>
        </div>
      );
    }
    case "sentinel_species": {
      const e = entity as SentinelRecord;
      return (
        <div>
          <SectionLabel>Wildlife Signal</SectionLabel>
          <div className="space-y-1 mb-4">
            <MetaRow label="Species" value={e.meta.species} />
            {e.meta.scientificName && (
              <MetaRow
                label="Scientific"
                value={<em>{e.meta.scientificName}</em>}
              />
            )}
            <MetaRow label="Group" value={e.meta.taxonGroup} />
            <MetaRow label="Observation" value={e.meta.observationType} />
            <MetaRow
              label="Severity"
              value={
                <span
                  className={cn(
                    "uppercase tracking-wider text-[10px]",
                    e.meta.severity === "critical" && "text-accent-contamination",
                    e.meta.severity === "high" && "text-accent-warning",
                    e.meta.severity === "moderate" && "text-accent-bio",
                    e.meta.severity === "low" && "text-text-muted"
                  )}
                >
                  {e.meta.severity}
                </span>
              }
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {e.meta.associatedContaminants.map((c) => (
              <ChemChip key={c} chem={c} />
            ))}
          </div>
        </div>
      );
    }
    case "reproductive_regions": {
      const e = entity as ReproductiveRegion;
      return (
        <div>
          <SectionLabel>Reproductive Indicator</SectionLabel>
          <div className="space-y-1">
            <MetaRow label="Metric" value={e.meta.metric} />
            <MetaRow
              label="Value"
              value={`${e.meta.value} ${e.meta.unit}`}
            />
            <MetaRow
              label="Trend"
              value={
                <span
                  className={cn(
                    "uppercase tracking-wider text-[10px]",
                    e.meta.trend === "increasing" && "text-accent-contamination",
                    e.meta.trend === "decreasing" && "text-accent-water",
                    e.meta.trend === "stable" && "text-text-muted",
                    e.meta.trend === "unknown" && "text-text-muted/60"
                  )}
                >
                  {e.meta.trend}
                </span>
              }
            />
            {e.meta.demographicGroup && (
              <MetaRow label="Population" value={e.meta.demographicGroup} />
            )}
          </div>
        </div>
      );
    }
    case "case_study_markers": {
      const e = entity as CaseStudyMarker;
      return (
        <div>
          <SectionLabel>Investigation</SectionLabel>
          <p className="text-xs leading-relaxed text-text-secondary mb-4 italic">
            {e.meta.subtitle}
          </p>
          <div className="space-y-1 mb-4">
            <MetaRow
              label="Signals"
              value={e.meta.keySignalCount.toString()}
            />
            <MetaRow
              label="Layers"
              value={e.meta.layerGroups.length.toString()}
            />
          </div>
          <Link
            href={`/case-studies/${e.meta.slug}`}
            className="group inline-flex items-center gap-2 text-sm text-accent-water hover:text-accent-water/80 transition-colors"
          >
            Read full investigation
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      );
    }
    case "legal_actions": {
      const e = entity as LegalAction;
      return (
        <div>
          <SectionLabel>Legal Action</SectionLabel>
          <div className="space-y-1 mb-4">
            <MetaRow label="Type" value={e.meta.actionType} />
            <MetaRow label="Agency" value={e.meta.agency} />
            <MetaRow
              label="Status"
              value={
                <span
                  className={cn(
                    "uppercase tracking-wider text-[10px]",
                    e.meta.status === "Settled" && "text-accent-bio",
                    e.meta.status === "Active" && "text-accent-warning"
                  )}
                >
                  {e.meta.status}
                </span>
              }
            />
            {e.meta.penaltyAmount !== undefined && (
              <MetaRow label="Penalty" value={fmtUSD(e.meta.penaltyAmount)} />
            )}
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {e.meta.description}
          </p>
        </div>
      );
    }
    default:
      return null;
  }
}

export function DetailDrawer() {
  const { drawerOpen, setDrawerOpen, selectedEntityId, setSelectedEntity } =
    useExploreStore();

  const entity = selectedEntityId ? getEntityById(selectedEntityId) : null;

  const layerGroup = entity ? LAYER_GROUPS[entity.layerGroup] : null;
  const layer = entity ? LAYERS[entity.layerId] : null;
  const evidenceInfo = entity ? EVIDENCE_LEVELS[entity.evidenceLevel] : null;

  // Resolve linked sources
  const linkedSources = entity
    ? mockSources.filter((s) => entity.sourceIds.includes(s.id))
    : [];

  return (
    <AnimatePresence>
      {drawerOpen && entity && (
        <motion.aside
          key="detail-drawer"
          initial={{ x: 420, opacity: 0, scaleX: 0.98 }}
          animate={{ x: 0, opacity: 1, scaleX: 1 }}
          exit={{ x: 420, opacity: 0, scaleX: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-20 w-[440px] max-w-full",
            "flex flex-col bg-panel overflow-hidden",
            "shadow-[-8px_0_32px_-8px_rgba(0,0,0,0.4)]"
          )}
          style={{
            borderLeft: "1px solid transparent",
            borderImage: layerGroup
              ? `linear-gradient(to bottom, ${layerGroup.color}40, var(--border-color) 40%, var(--border-color)) 1`
              : undefined,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 py-6 border-b border-border/60">
            <div className="flex-1 min-w-0 pr-4">
              {layerGroup && layer && (
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: layerGroup.color }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.15em]"
                    style={{ color: layerGroup.color }}
                  >
                    {layer.label}
                  </span>
                </div>
              )}
              <h2 className="font-serif text-xl font-light leading-tight text-foreground">
                {entity.name}
              </h2>
            </div>
            <button
              onClick={() => {
                setDrawerOpen(false);
                setSelectedEntity(null);
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
                  {entity.summary}
                </p>
              </div>

              <Divider />

              {/* Layer-specific signals */}
              <LayerSpecificDetails entity={entity} />

              <Divider />

              {/* Location Context */}
              <div>
                <SectionLabel>Location Context</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                    <span>
                      {entity.county}, {entity.state}
                    </span>
                  </div>
                  {entity.year && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                      <span>
                        {entity.year}
                        {entity.yearEnd && entity.yearEnd !== entity.year
                          ? `–${entity.yearEnd}`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[11px] font-mono text-text-muted">
                  {entity.latitude.toFixed(4)}°N,{" "}
                  {Math.abs(entity.longitude).toFixed(4)}°W
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
                      levelAccentMap[entity.evidenceLevel]
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

              {/* Tags */}
              {entity.tags && entity.tags.length > 0 && (
                <>
                  <div>
                    <SectionLabel>Tags</SectionLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {entity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] text-text-muted"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </>
              )}

              {/* Related Sources */}
              <div>
                <SectionLabel>Related Sources</SectionLabel>
                {linkedSources.length === 0 ? (
                  <p className="text-xs text-text-muted italic">
                    No sources cataloged yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {linkedSources.map((src) => (
                      <li key={src.id}>
                        <Link
                          href="/sources"
                          className="group flex items-start gap-2 text-xs text-text-secondary hover:text-accent-water transition-colors duration-300"
                        >
                          <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>
                            {src.name}
                            {src.agency && (
                              <span className="text-text-muted/70 ml-1">
                                — {src.agency}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Divider />

              {/* Uncertainty Note */}
              <div className="rounded-lg bg-surface/60 border border-border/50 px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-accent-warning/70 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-[1.6] text-text-muted">
                    Proximity of industrial activity to health outcomes does
                    not establish causation. This data represents publicly
                    available records and may not reflect current site
                    conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/60 px-7 py-4 flex items-center justify-between">
            <Link
              href="/methodology"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-text-muted hover:text-text-secondary transition-colors duration-300"
            >
              <Activity className="h-3 w-3" />
              Confidence framework
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
