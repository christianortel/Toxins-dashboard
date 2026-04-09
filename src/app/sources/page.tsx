import { ExternalLink, Calendar, RefreshCw, FileText } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { mockSources } from "@/data/mock/sources";
import { LAYER_GROUPS } from "@/lib/constants";
import type { LayerGroupId, SourceReference } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Source Registry — DOWNSTREAM",
  description:
    "A comprehensive registry of every data source used in the DOWNSTREAM project, with descriptions, agencies, last-updated dates, and known caveats.",
};

const GROUP_ORDER: LayerGroupId[] = [
  "official",
  "emerging",
  "wildlife",
  "reproductive",
  "regulatory",
];

function groupSources(sources: SourceReference[]) {
  const map = new Map<LayerGroupId, SourceReference[]>();
  for (const id of GROUP_ORDER) map.set(id, []);
  for (const s of sources) {
    map.get(s.layerGroup)?.push(s);
  }
  return map;
}

export default function SourcesPage() {
  const grouped = groupSources(mockSources);
  const totalSources = mockSources.length;

  return (
    <>
      <SiteHeader />
      <PageContainer>
        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Source Registry
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Every data point in DOWNSTREAM traces back to a publicly available
            source. This registry documents each one — what it covers, who
            maintains it, when it was last updated, and what caveats apply.
            Transparency about data provenance is foundational to the project.
          </p>

          {/* Quick stats */}
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            <div className="bg-surface p-5">
              <dt className="text-[10px] uppercase tracking-widest text-text-muted">
                Sources
              </dt>
              <dd className="mt-2 font-serif text-3xl font-light text-foreground tabular-nums">
                {totalSources}
              </dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="text-[10px] uppercase tracking-widest text-text-muted">
                Layer Groups
              </dt>
              <dd className="mt-2 font-serif text-3xl font-light text-foreground tabular-nums">
                {GROUP_ORDER.length}
              </dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="text-[10px] uppercase tracking-widest text-text-muted">
                Federal
              </dt>
              <dd className="mt-2 font-serif text-3xl font-light text-foreground tabular-nums">
                {
                  mockSources.filter(
                    (s) =>
                      s.agency &&
                      ["EPA", "CDC", "USGS", "ATSDR / CDC"].some((a) =>
                        s.agency!.includes(a)
                      )
                  ).length
                }
              </dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="text-[10px] uppercase tracking-widest text-text-muted">
                Open License
              </dt>
              <dd className="mt-2 font-serif text-3xl font-light text-foreground tabular-nums">
                {
                  mockSources.filter((s) =>
                    s.license?.includes("Public Domain")
                  ).length
                }
              </dd>
            </div>
          </dl>

          {/* Group filter chips */}
          <nav className="mt-8 flex flex-wrap items-center gap-2">
            {GROUP_ORDER.map((id) => {
              const group = LAYER_GROUPS[id];
              const count = grouped.get(id)?.length ?? 0;
              return (
                <a
                  key={id}
                  href={`#group-${id}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] uppercase tracking-widest text-text-muted transition-colors hover:text-foreground"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  {group.label}
                  <span className="text-text-muted/50 tabular-nums">
                    {count}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Grouped source cards */}
        <div className="mt-16 space-y-20">
          {GROUP_ORDER.map((groupId) => {
            const group = LAYER_GROUPS[groupId];
            const sources = grouped.get(groupId) ?? [];
            if (sources.length === 0) return null;

            return (
              <section
                key={groupId}
                id={`group-${groupId}`}
                className="scroll-mt-24"
              >
                {/* Group header */}
                <div className="flex items-end justify-between border-b border-border/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-[0.15em] font-medium"
                        style={{ color: group.color }}
                      >
                        {group.label}
                      </span>
                    </div>
                    <h2 className="mt-2 font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
                      {group.description}
                    </h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-text-muted">
                    {sources.length}{" "}
                    {sources.length === 1 ? "source" : "sources"}
                  </span>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {sources.map((source) => (
                    <article
                      key={source.id}
                      className="group relative overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]"
                      style={
                        {
                          "--layer-color": group.color,
                        } as React.CSSProperties
                      }
                    >
                      {/* Colored top bar */}
                      <div
                        className="h-[3px] w-full rounded-t-lg"
                        style={{ background: group.color }}
                      />

                      <div className="p-6 transition-colors duration-300 group-hover:border-[var(--layer-color)]">
                        {/* Agency & ID chip */}
                        <div className="mb-4 flex items-center justify-between gap-3">
                          {source.agency && (
                            <span className="text-[10px] uppercase tracking-widest text-text-muted">
                              {source.agency}
                            </span>
                          )}
                          {source.shortName && (
                            <span className="inline-flex items-center rounded-full border border-border bg-panel px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-text-muted">
                              {source.shortName}
                            </span>
                          )}
                        </div>

                        {/* Source name */}
                        <h3 className="font-serif text-xl font-light tracking-tight text-foreground">
                          {source.name}
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                          {source.description}
                        </p>

                        {/* Metadata grid */}
                        <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Updated{" "}
                              {new Date(source.lastUpdated).toLocaleDateString(
                                "en-US",
                                { year: "numeric", month: "short" }
                              )}
                            </span>
                          </div>
                          {source.updateFrequency && (
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="h-3 w-3" />
                              <span>{source.updateFrequency}</span>
                            </div>
                          )}
                          {source.license && (
                            <div className="col-span-2 flex items-center gap-1.5">
                              <FileText className="h-3 w-3" />
                              <span className="truncate">
                                {source.license}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Caveats */}
                        <div className="mt-5 rounded border border-amber-900/10 bg-amber-950/5 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-widest text-text-muted">
                            Known caveats
                          </p>
                          <p className="mt-1 text-xs italic leading-relaxed text-text-muted">
                            {source.caveats}
                          </p>
                        </div>

                        {/* Footer: external link */}
                        <div className="mt-5 flex items-center justify-end">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors duration-200 hover:text-text-secondary"
                            >
                              Visit source
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-text-muted/50">
                              No public URL
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-20 max-w-3xl rounded-lg border border-border bg-panel/50 px-6 py-5">
          <p className="text-xs leading-relaxed text-text-muted">
            This registry reflects the sources currently integrated into the
            DOWNSTREAM platform. Additional data sources are under evaluation
            and may be added as the project expands. If you are aware of a
            publicly available data source that should be included here, we
            welcome suggestions through the project contact channels.
          </p>
        </div>
      </PageContainer>

      <SiteFooter />
    </>
  );
}
