import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import { mockCaseStudies } from "@/data/mock/case-studies";
import { LAYER_GROUPS } from "@/lib/constants";
import type { LayerGroupId } from "@/types";

function getGradientForGroups(groups: LayerGroupId[]): string {
  if (groups.length === 0) return "var(--accent-neutral)";
  if (groups.length === 1) return LAYER_GROUPS[groups[0]].color;
  const colors = groups.map((g) => LAYER_GROUPS[g].color);
  return `linear-gradient(to right, ${colors.join(", ")})`;
}

export default function CaseStudiesPage() {
  return (
    <>
      <SiteHeader />
      <PageContainer>
        <div className="max-w-4xl">
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Investigations
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Investigative deep-dives into the places where industrial
            contamination, environmental signals, and community health concerns
            converge. Each case study traces the evidence across multiple data
            layers, grading the strength of what is known and what remains
            uncertain.
          </p>
          <div className="mt-2 h-px w-16 bg-accent-water/40" />
        </div>

        {/* Count */}
        <p className="mt-14 text-xs uppercase tracking-widest text-text-muted">
          {mockCaseStudies.length} investigations
        </p>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          {mockCaseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group block"
            >
              <article className="relative overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:border-border/80 hover:bg-surface/80 hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]">
                {/* Colored top bar */}
                <div
                  className="h-[3px] w-full rounded-t-lg"
                  style={{
                    background: getGradientForGroups(study.layerGroups),
                  }}
                />

                <div className="p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted">
                      {study.location}
                    </span>
                    <EvidenceBadge level={study.evidenceLevel} />
                  </div>

                  <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
                    {study.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {study.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-text-muted line-clamp-3">
                    {study.summary}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs text-text-muted transition-colors duration-300 group-hover:text-text-secondary">
                    <span className="uppercase tracking-widest">
                      Read investigation
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </PageContainer>

      <SiteFooter />
    </>
  );
}
