import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — DOWNSTREAM",
  description:
    "The mission, principles, and people behind the DOWNSTREAM investigative environmental data project.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageContainer>
        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            About DOWNSTREAM
          </h1>
        </div>

        {/* Mission */}
        <section className="mt-12 max-w-3xl">
          <div className="space-y-6 text-base leading-[1.8] text-text-secondary">
            <p>
              DOWNSTREAM began with a simple observation: the data about
              industrial contamination, the data about wildlife health, and the
              data about human reproductive trends all exist — but they rarely
              appear on the same map. This project brings them together, not to
              draw conclusions, but to make overlapping patterns visible in ways
              that spreadsheets and agency databases alone cannot.
            </p>
            <p>
              We believe that environmental health data should be accessible,
              geographically legible, and transparent about its limitations.
              When a community sits downstream of industrial activity, its
              residents deserve to see what is known, what is uncertain, and
              what questions remain unanswered — without needing to cross-
              reference dozens of federal databases and academic papers.
            </p>
            <p>
              This is an editorial and investigative project, not a regulatory
              tool or a scientific publication. We present publicly available
              data with context, source attribution, and evidence grading. We
              take scientific uncertainty seriously, and we name it explicitly
              wherever it exists.
            </p>
          </div>
        </section>

        {/* What this project is / isn't */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            What This Project Is
          </h2>

          <ul className="mt-6 space-y-3">
            {[
              "A visual investigation that maps the geography of industrial contamination alongside environmental and health signals",
              "An editorial platform that synthesizes publicly available data into case studies with full source transparency",
              "A tool for making complex, dispersed environmental data more accessible to journalists, researchers, advocates, and the public",
              "An exercise in responsible data communication — grading evidence, naming uncertainty, and distinguishing correlation from causation",
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

          <h2 className="mt-12 font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            What This Project Is Not
          </h2>

          <ul className="mt-6 space-y-3">
            {[
              "Not a substitute for peer-reviewed scientific research or epidemiological study",
              "Not a platform for establishing causation between specific exposures and specific health outcomes",
              "Not medical or legal advice of any kind",
              "Not affiliated with any government agency, regulatory body, or advocacy organization",
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
        </section>

        {/* Principles */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Guiding Principles
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Transparency First",
                description:
                  "Every data point links to its source. Every case study names its evidence level. Every limitation is stated plainly.",
              },
              {
                title: "Scientific Humility",
                description:
                  "Environmental health is complex. We present what is known, flag what is uncertain, and resist the temptation to overstate.",
              },
              {
                title: "Geographic Legibility",
                description:
                  "Data that exists only in tables and databases is functionally invisible. Mapping it makes patterns accessible to the communities they affect.",
              },
              {
                title: "Editorial Independence",
                description:
                  "DOWNSTREAM is an independent project. It does not accept funding from industries it investigates, nor does it advocate for predetermined policy outcomes.",
              },
            ].map((principle) => (
              <div
                key={principle.title}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h3 className="font-serif text-lg font-light text-foreground">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Team
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            DOWNSTREAM is maintained by a small team of journalists, data
            scientists, and environmental researchers. The project draws on
            expertise in investigative reporting, geographic information
            systems, environmental toxicology, and public health data
            communication. Full team bios and institutional affiliations will
            be published as the project moves from development into public
            release.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Contact & Contribute
          </h2>

          <div className="mt-6 space-y-6 text-sm leading-relaxed text-text-secondary">
            <p>
              We welcome corrections, source suggestions, and collaboration
              inquiries from scientists, journalists, and community
              organizations working on environmental health issues.
            </p>
            <p>
              If you have identified an error in our data presentation, know
              of a publicly available data source that should be included, or
              are a researcher whose work intersects with the themes of this
              project, we would like to hear from you.
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-surface p-6">
            <p className="text-sm text-text-muted">
              Contact channels will be published with the public launch of the
              project. In the interim, the project repository and contribution
              guidelines are available for review.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-20 max-w-3xl rounded-lg border border-border bg-panel/50 px-6 py-5">
          <p className="text-xs leading-relaxed text-text-muted">
            DOWNSTREAM is an independent project. The data presented here is
            sourced from publicly available government databases, peer-reviewed
            research, and established monitoring programs. The project does not
            generate original scientific data, conduct laboratory analyses, or
            perform clinical assessments. All interpretations and editorial
            framing are those of the project team and do not represent the
            positions of any data source agency or institution.
          </p>
        </div>
      </PageContainer>

      <SiteFooter />
    </>
  );
}
