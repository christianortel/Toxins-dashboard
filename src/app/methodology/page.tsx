import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { MethodologyAccordion } from "@/components/shared/methodology-accordion";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import { methodologySections } from "@/data/mock/methodology";
import { EVIDENCE_LEVELS } from "@/lib/constants";
import type { EvidenceLevel } from "@/types";
import type { Metadata } from "next";

const evidenceAccentColors: Record<EvidenceLevel, string> = {
  direct: "var(--accent-water)",
  proxy: "var(--accent-bio)",
  screening: "var(--accent-warning)",
  literature: "var(--accent-contamination)",
  editorial: "var(--accent-neutral)",
};

export const metadata: Metadata = {
  title: "Methodology — DOWNSTREAM",
  description:
    "How DOWNSTREAM gathers, categorizes, and presents environmental and health data — and the limits of what this project can and cannot claim.",
};

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero header area */}
      <div className="relative overflow-hidden border-b border-border/40">
        {/* Atmospheric background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, var(--accent-water), transparent 60%), radial-gradient(ellipse at 80% 30%, var(--accent-bio), transparent 60%)",
          }}
        />
        <PageContainer>
          <div className="relative max-w-3xl py-4">
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
        </PageContainer>
      </div>

      <PageContainer>
        {/* Data Layers Accordion */}
        <section id="data-layers" className="mt-24">
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
        <section id="evidence-levels" className="mt-28">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Understanding Evidence Levels
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
            Every data point and case study in DOWNSTREAM carries an evidence
            level indicating the type and strength of available data. These
            levels are not value judgments — they are transparency tools.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {(
              Object.entries(EVIDENCE_LEVELS) as [
                EvidenceLevel,
                (typeof EVIDENCE_LEVELS)[EvidenceLevel],
              ][]
            ).map(([key, level]) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-surface p-7"
                style={{
                  borderLeft: `3px solid ${evidenceAccentColors[key]}`,
                }}
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
        <section id="scientific-caution" className="mt-28 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            A Note on Scientific Caution
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-secondary">
                <CheckCircle2 size={15} className="text-accent-water" />
                What this project does
              </h3>
              <ul className="mt-5 space-y-3.5">
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
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-water/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-secondary">
                <XCircle size={15} className="text-accent-warning" />
                What this project does not do
              </h3>
              <ul className="mt-5 space-y-3.5">
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
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-warning/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 rounded-lg border border-border bg-panel/50 px-6 py-5">
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
