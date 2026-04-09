import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
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

            {/* In-page TOC */}
            <nav className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] text-text-muted">
              <a href="#data-layers" className="hover:text-foreground transition-colors">
                Data Layers
              </a>
              <span className="text-border">·</span>
              <a href="#evidence-levels" className="hover:text-foreground transition-colors">
                Evidence Levels
              </a>
              <span className="text-border">·</span>
              <a href="#confidence-framework" className="hover:text-foreground transition-colors">
                Confidence Framework
              </a>
              <span className="text-border">·</span>
              <a href="#uncertainty" className="hover:text-foreground transition-colors">
                Handling Uncertainty
              </a>
              <span className="text-border">·</span>
              <a href="#scientific-caution" className="hover:text-foreground transition-colors">
                Scientific Caution
              </a>
            </nav>
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

        {/* Confidence Framework */}
        <section id="confidence-framework" className="mt-28 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Confidence Framework in Practice
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Each entity in the explorer carries an evidence level. Each case
            study carries a methodology note. Each source in the registry
            carries an explicit list of caveats. Together, these three layers
            form the project&rsquo;s confidence framework — a way for readers
            to evaluate not just what we are showing, but how much trust to
            place in it.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Source Provenance",
                body: "Every data point traces to a primary, publicly accessible source. Source records include update frequency, license, and known caveats — never just the URL.",
              },
              {
                step: "02",
                title: "Evidence Tagging",
                body: "Each entity is tagged Direct, Proxy, Screening, Literature, or Editorial. These tags travel with the data through the entire UI — they appear in the map, the drawer, the case studies.",
              },
              {
                step: "03",
                title: "Uncertainty Surfacing",
                body: "Where reasonable people disagree — replication failures, contested epidemiology, modeled vs. measured values — we surface that disagreement rather than smooth it over.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="relative rounded-lg border border-border bg-surface/50 px-6 py-7"
              >
                <span className="absolute right-5 top-4 font-mono text-[10px] tracking-widest text-text-muted/40">
                  {step}
                </span>
                <h3 className="font-serif text-lg font-light text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Handling Uncertainty */}
        <section id="uncertainty" className="mt-28 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Handling Uncertainty
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Environmental health data carries several distinct kinds of
            uncertainty, each demanding a different editorial response.
          </p>

          <div className="mt-10 space-y-5">
            {[
              {
                kind: "Measurement",
                detail:
                  "Detection limits, analytical method variation, sampling coverage gaps. We record method and detection limit alongside any concentration value, and we never silently truncate non-detects.",
              },
              {
                kind: "Modeling",
                detail:
                  "Many federal data products (AirToxScreen, ATSDR exposure reconstructions) are modeled, not measured. We label modeled values as such and retain published confidence intervals.",
              },
              {
                kind: "Causal Inference",
                detail:
                  "Population-level associations cannot establish individual causation. We restate this whenever a regional or epidemiological trend appears, and we never present a correlation as a finding of harm.",
              },
              {
                kind: "Coverage",
                detail:
                  "Absence of data is not absence of risk. Counties, communities, and chemicals not tracked by federal programs are simply unseen — we say so.",
              },
              {
                kind: "Temporal",
                detail:
                  "Most federal data is reported with a 1-3 year lag. Year fields in the explorer reflect the year of measurement, not the year of reporting, and are caveated when known to be stale.",
              },
            ].map(({ kind, detail }) => (
              <div
                key={kind}
                className="flex gap-5 border-l-2 border-border/60 pl-5"
              >
                <span className="mt-0.5 flex-shrink-0 text-[10px] uppercase tracking-[0.15em] text-text-muted w-32">
                  {kind}
                </span>
                <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                  {detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-amber-900/20 bg-amber-950/5 px-6 py-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-accent-warning/70 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-text-muted">
                When in doubt, we err on the side of underclaiming. The
                purpose of DOWNSTREAM is to make environmental information
                navigable and legible — not to score points against any
                facility, agency, or chemical. If a data layer is too noisy
                to interpret, we say so rather than dressing it up.
              </p>
            </div>
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
