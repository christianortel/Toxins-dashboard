import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { mockSources } from "@/data/mock/sources";
import { LAYER_GROUPS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Source Registry — DOWNSTREAM",
  description:
    "A comprehensive registry of every data source used in the DOWNSTREAM project, with descriptions, agencies, last-updated dates, and known caveats.",
};

export default function SourcesPage() {
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
        </div>

        {/* Filter count summary */}
        <p className="mt-14 text-xs uppercase tracking-widest text-text-muted">
          {mockSources.length} verified data sources
        </p>

        {/* Source cards */}
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {mockSources.map((source) => {
            const layerGroup = LAYER_GROUPS[source.layerGroup];

            return (
              <article
                key={source.id}
                className="group relative overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]"
                style={
                  {
                    "--layer-color": layerGroup.color,
                  } as React.CSSProperties
                }
              >
                {/* Colored top bar */}
                <div
                  className="h-[3px] w-full rounded-t-lg"
                  style={{ background: layerGroup.color }}
                />

                <div className="p-6 transition-colors duration-300 group-hover:border-[var(--layer-color)]">
                  {/* Agency & layer chip */}
                  <div className="mb-4 flex items-center justify-between gap-3">
                    {source.agency && (
                      <span className="text-[10px] uppercase tracking-widest text-text-muted">
                        {source.agency}
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-panel px-2.5 py-0.5 text-[10px] uppercase tracking-widest"
                      style={{ color: layerGroup.color }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: layerGroup.color }}
                      />
                      {layerGroup.label}
                    </span>
                  </div>

                  {/* Source name */}
                  <h2 className="font-serif text-xl font-light tracking-tight text-foreground">
                    {source.name}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {source.description}
                  </p>

                  {/* Caveats */}
                  <div className="mt-4 rounded border border-amber-900/10 bg-amber-950/5 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted">
                      Known caveats
                    </p>
                    <p className="mt-1 text-xs italic leading-relaxed text-text-muted">
                      {source.caveats}
                    </p>
                  </div>

                  {/* Footer: last updated + external link */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted">
                      Updated{" "}
                      {new Date(source.lastUpdated).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                        }
                      )}
                    </span>

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
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 max-w-3xl rounded-lg border border-border bg-panel/50 px-6 py-5">
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
