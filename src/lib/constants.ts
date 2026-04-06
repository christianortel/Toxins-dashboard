export const SITE_NAME = "DOWNSTREAM";
export const SITE_TAGLINE = "The body downstream of industry.";
export const SITE_DESCRIPTION =
  "An investigative exploration of how industrial contamination, endocrine-disrupting chemicals, and environmental hazards may overlap with wildlife abnormalities and human health warning signals.";

export const NAV_ITEMS = [
  { label: "Explore", href: "/explore" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Methodology", href: "/methodology" },
  { label: "Sources", href: "/sources" },
  { label: "About", href: "/about" },
] as const;

export const LAYER_GROUPS = {
  official: {
    id: "official",
    label: "Official Releases",
    description: "EPA, state-reported toxic releases and hazardous sites",
    color: "var(--accent-contamination)",
  },
  emerging: {
    id: "emerging",
    label: "Emerging Contaminants",
    description: "PFAS, microplastics, pharmaceutical waste",
    color: "var(--accent-warning)",
  },
  wildlife: {
    id: "wildlife",
    label: "Wildlife Sentinels",
    description: "Species abnormalities, die-offs, reproductive issues",
    color: "var(--accent-bio)",
  },
  reproductive: {
    id: "reproductive",
    label: "Reproductive Health",
    description: "Fertility trends, sperm count studies, birth outcomes",
    color: "var(--accent-water)",
  },
  regulatory: {
    id: "regulatory",
    label: "Regulatory Gaps",
    description: "Legal challenges, consent decrees, enforcement actions",
    color: "var(--accent-neutral)",
  },
} as const;

export const EVIDENCE_LEVELS = {
  direct: {
    label: "Direct Measurement",
    description: "Measured data from official monitoring or peer-reviewed studies",
  },
  proxy: {
    label: "Proxy Indicator",
    description: "Indirect signal correlated with but not directly measuring the concern",
  },
  screening: {
    label: "Screening Signal",
    description: "Preliminary or exploratory data warranting further investigation",
  },
  literature: {
    label: "Literature Evidence",
    description: "Published scientific research supporting the association",
  },
  editorial: {
    label: "Editorial Case Study",
    description: "Investigative journalism or community-reported observation",
  },
} as const;
