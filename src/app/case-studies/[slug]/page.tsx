import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, ExternalLink, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import { mockCaseStudies } from "@/data/mock/case-studies";
import { LAYER_GROUPS } from "@/lib/constants";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return mockCaseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = mockCaseStudies.find((s) => s.slug === slug);
  if (!study) return { title: "Case Study Not Found" };
  return {
    title: `${study.title} — DOWNSTREAM`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = mockCaseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const layerColors = study.layerGroups.map((g) => LAYER_GROUPS[g]);

  return (
    <>
      <SiteHeader />
      <PageContainer>
        {/* Back link */}
        <Link
          href="/case-studies"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-text-muted transition-colors duration-200 hover:text-text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="border-b border-transparent transition-all duration-200 group-hover:border-text-muted/40">
            All investigations
          </span>
        </Link>

        {/* Header with subtle atmospheric gradient */}
        <header className="relative mt-14 max-w-3xl">
          {/* Atmospheric radial gradient */}
          <div
            className="pointer-events-none absolute -left-32 -top-32 h-[400px] w-[500px] opacity-[0.07]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, var(--accent-water), transparent 70%)",
            }}
          />

          {/* Layer group chips */}
          <div className="relative mb-6 flex flex-wrap items-center gap-3">
            {layerColors.map((layer) => (
              <span
                key={layer.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-panel px-3 py-1 text-[10px] uppercase tracking-widest"
                style={{ color: layer.color }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                {layer.label}
              </span>
            ))}
          </div>

          <h1
            className="relative font-serif text-4xl font-light text-foreground md:text-5xl lg:text-[3.8rem]"
            style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
          >
            {study.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary md:text-xl">
            {study.subtitle}
          </p>

          {/* Metadata row */}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-b border-border py-4">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <MapPin className="h-3.5 w-3.5" />
              {study.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(study.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <EvidenceBadge level={study.evidenceLevel} />
          </div>
        </header>

        {/* Body */}
        <article className="mt-14 max-w-[680px]">
          <div className="space-y-6 text-[15px] leading-[1.85] text-text-secondary">
            {study.body.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Key Findings */}
          <section className="mt-20">
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
              Key Findings
            </h2>
            <div className="mt-1 h-px w-12 bg-accent-contamination opacity-40" />

            <ul className="mt-8 space-y-5">
              {study.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 font-serif text-lg text-accent-water">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-text-secondary">
                    {finding}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sources */}
          <section className="mt-20">
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
              Sources
            </h2>
            <div className="mt-1 h-px w-12 bg-accent-water opacity-40" />

            <div className="mt-8 space-y-4">
              {study.sources.map((source) => {
                const sourceColor =
                  LAYER_GROUPS[source.layerGroup]?.color ??
                  "var(--accent-neutral)";

                return (
                  <div
                    key={source.id}
                    className="overflow-hidden rounded-lg border border-border bg-surface"
                    style={{
                      borderLeft: `3px solid ${sourceColor}`,
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-sm font-medium text-foreground">
                              {source.name}
                            </h3>
                            {source.agency && (
                              <span className="text-[10px] uppercase tracking-widest text-text-muted">
                                {source.agency}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">
                            {source.description}
                          </p>
                          <p className="mt-2 text-xs italic text-text-muted">
                            Caveat: {source.caveats}
                          </p>
                        </div>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-text-muted transition-colors hover:text-text-secondary"
                            aria-label={`Visit ${source.name}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Methodology note */}
          {study.methodologyNote && (
            <section className="mt-20">
              <h2 className="flex items-center gap-2.5 font-serif text-2xl font-light tracking-tight text-foreground">
                <BookOpen className="h-4 w-4 text-text-muted" />
                Methodology Note
              </h2>
              <div className="mt-1 h-px w-12 bg-accent-bio opacity-40" />
              <p className="mt-8 text-sm leading-[1.85] text-text-secondary">
                {study.methodologyNote}
              </p>
            </section>
          )}

          {/* Editorial disclaimer */}
          <div className="mt-20 rounded-lg border border-border bg-panel/50 px-6 py-5">
            <p className="text-xs leading-relaxed text-text-muted">
              This case study presents publicly available data and published
              research. Proximity of industrial activity and health outcomes does
              not establish causation. Evidence levels reflect the strength and
              type of available data, not definitive conclusions. Readers are
              encouraged to consult primary sources and peer-reviewed literature
              for the most current understanding.
            </p>
          </div>
        </article>
      </PageContainer>

      <SiteFooter />
    </>
  );
}
