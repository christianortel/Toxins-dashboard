import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { MethodologyAccordion } from "@/components/shared/methodology-accordion";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import { methodologySections } from "@/data/mock/methodology";
import { EVIDENCE_LEVELS } from "@/lib/constants";
import type { EvidenceLevel } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology — DOWNSTREAM",
  description:
    "How DOWNSTREAM gathers, categorizes, and presents environmental and health data — and the limits of what this project can and cannot claim.",
};

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader />
      <PageContainer>
        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Methodology
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            DOWNSTREAM aggregates publicly available environmental, health, and
            wildlife data to surface patterns that might otherwise remain
            invisible. This page explains how we source, categorize, and present
            that data — and, critically, the limits of what any such aggregation
            can claim.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            Environmental health is a domain of genuine scientific complexity.
            Proximity is not causation. Correlation across data layers is a
            signal worth investigating, not a conclusion. We grade every data
            point and every case study by evidence level precisely because
            certainty varies and transparency matters.
          </p>
        </div>

        {/* Data Layers Accordion */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Data Layers
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
            Each layer in the DOWNSTREAM explorer draws from distinct data
            sources with different levels of certainty, coverage, and
            limitation. Expand any layer below to understand exactly what it
            measures, what it does not, and where uncertainty remains.
          </p>

          <div className="mt-10">
            <MethodologyAccordion items={methodologySections} />
          </div>
        </section>

        {/* Evidence Levels */}
        <section className="mt-24">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Understanding Evidence Levels
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
            Every data point and case study in DOWNSTREAM carries an evidence
            level indicating the type and strength of available data. These
            levels are not value judgments — they are transparency tools.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(
              Object.entries(EVIDENCE_LEVELS) as [
                EvidenceLevel,
                (typeof EVIDENCE_LEVELS)[EvidenceLevel],
              ][]
            ).map(([key, level]) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <div className="mb-3">
                  <EvidenceBadge level={key} />
                </div>
                <h3 className="font-serif text-lg font-light text-foreground">
                  {level.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Scientific Caution */}
        <section className="mt-24 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            A Note on Scientific Caution
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                What this project does
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Aggregates publicly available data from government agencies, peer-reviewed studies, and established monitoring programs",
                  "Maps proximity between industrial activity, environmental contamination, wildlife abnormalities, and population health trends",
                  "Grades every data point by evidence level so readers can assess the strength of available information",
                  "Presents case studies that trace evidence across multiple data layers with full source attribution",
                  "Acknowledges uncertainty explicitly wherever it exists",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-water" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                What this project does not do
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Establish causation between any industrial activity and any specific health outcome",
                  "Replace peer-reviewed epidemiological research or regulatory risk assessment",
                  "Claim that proximity to contamination sites constitutes proof of harm",
                  "Provide medical advice or individual risk assessment",
                  "Advocate for specific policy positions or regulatory changes",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-warning" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-lg border border-border bg-panel/50 px-6 py-5">
            <p className="text-xs leading-relaxed text-text-muted">
              The absence of data does not mean the absence of risk, and the
              presence of data does not mean the presence of harm. DOWNSTREAM
              exists to make environmental information more accessible and
              geographically legible — to help people ask better questions, not
              to provide definitive answers. We urge readers to consult primary
              sources, engage with the scientific literature, and support
              continued research in environmental and reproductive health.
            </p>
          </div>
        </section>
      </PageContainer>

      <SiteFooter />
    </>
  );
}
