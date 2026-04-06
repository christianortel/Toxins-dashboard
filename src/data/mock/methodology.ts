import type { MethodologySection, FeaturedStatistic, TimelineEntry } from "@/types";

export const methodologySections: MethodologySection[] = [
  {
    id: "official-releases",
    title: "Official Toxic Releases",
    description:
      "Data from EPA's Toxics Release Inventory and Superfund program, representing government-tracked industrial contamination.",
    measures:
      "Self-reported chemical releases from regulated facilities, National Priorities List site locations, enforcement actions.",
    doesNotMeasure:
      "Unreported releases, facilities below reporting thresholds, chemicals not on TRI lists, cumulative exposure from multiple sources.",
    evidenceType: "direct",
    uncertainties: [
      "Self-reported data may understate actual releases",
      "Reporting thresholds exclude smaller but persistent releases",
      "Not all industrial sectors are covered",
      "Legacy contamination from closed facilities may be absent",
    ],
  },
  {
    id: "emerging-contaminants",
    title: "Emerging Contaminants",
    description:
      "PFAS, microplastics, pharmaceutical residues, and other chemicals of emerging concern not fully captured by traditional monitoring.",
    measures:
      "Known PFAS detections, documented contamination sites, emerging monitoring data from UCMR programs.",
    doesNotMeasure:
      "The full scope of PFAS compounds (thousands exist, few are tested for), synergistic effects of chemical mixtures, cumulative lifetime exposure.",
    evidenceType: "direct",
    uncertainties: [
      "Analytical methods exist for only a fraction of PFAS compounds",
      "Health thresholds are evolving and contested",
      "Geographic coverage of testing is uneven",
      "Exposure pathways beyond drinking water are not well characterized",
    ],
  },
  {
    id: "wildlife-sentinels",
    title: "Wildlife Sentinel Species",
    description:
      "Observations of abnormalities, reproductive disruption, and population changes in wildlife species that may signal environmental contamination.",
    measures:
      "Documented intersex fish, amphibian deformities, reproductive failure in birds, population decline data where available.",
    doesNotMeasure:
      "Direct human health risk. Wildlife abnormalities suggest environmental stress but cannot establish causation for human outcomes.",
    evidenceType: "proxy",
    uncertainties: [
      "Wildlife monitoring is geographically patchy",
      "Abnormality causes are often multifactorial",
      "Baseline rates for many species are poorly established",
      "Observer bias and survey methodology vary between studies",
    ],
  },
  {
    id: "reproductive-health",
    title: "Reproductive Health Indicators",
    description:
      "Population-level trends in fertility, sperm counts, birth outcomes, and reproductive health metrics from epidemiological studies.",
    measures:
      "National fertility rate trends, meta-analytic sperm count data, birth defect registry data, ART utilization rates.",
    doesNotMeasure:
      "Individual-level causation. Population trends reflect many interacting factors including social, economic, and behavioral changes.",
    evidenceType: "screening",
    uncertainties: [
      "Ecological fallacy: population trends cannot establish individual causation",
      "Confounding from lifestyle, economic, and social factors",
      "Historical data quality and methodological consistency vary",
      "Selection bias in study populations",
    ],
  },
  {
    id: "regulatory-gaps",
    title: "Regulatory and Legal Context",
    description:
      "Enforcement actions, consent decrees, legal challenges, and areas where regulatory frameworks may not fully address emerging scientific understanding.",
    measures:
      "EPA enforcement data, legal settlement records, regulatory threshold comparisons, legislative developments.",
    doesNotMeasure:
      "Whether current regulations are adequate. This layer contextualizes the regulatory landscape without making policy prescriptions.",
    evidenceType: "literature",
    uncertainties: [
      "Enforcement data reflects agency priorities and resources, not just violation severity",
      "Legal outcomes do not establish scientific consensus",
      "Regulatory thresholds may lag behind evolving science",
    ],
  },
];

export const featuredStatistics: FeaturedStatistic[] = [
  {
    value: "4,700+",
    label: "PFAS Compounds",
    context: "Known PFAS compounds, of which fewer than 100 have established health guidelines",
    source: "EPA PFAS Strategic Roadmap",
    evidenceLevel: "direct",
  },
  {
    value: "52%",
    label: "Sperm Count Decline",
    context: "Decline in average sperm concentration among Western men since 1973",
    source: "Levine et al., 2023 meta-analysis",
    evidenceLevel: "literature",
  },
  {
    value: "1,300+",
    label: "Superfund Sites",
    context: "Active National Priorities List sites across the United States",
    source: "EPA Superfund Program",
    evidenceLevel: "direct",
  },
  {
    value: "~200M",
    label: "People Exposed",
    context: "Estimated Americans with PFAS detectable in their drinking water",
    source: "EWG Tap Water Database analysis",
    evidenceLevel: "screening",
  },
];

export const timelineEntries: TimelineEntry[] = [
  { year: 1962, label: "Silent Spring", description: "Rachel Carson publishes Silent Spring, catalyzing the modern environmental movement" },
  { year: 1970, label: "EPA Established", description: "The Environmental Protection Agency is created by executive order" },
  { year: 1980, label: "Superfund Act", description: "CERCLA (Superfund) enacted to clean up hazardous waste sites" },
  { year: 1986, label: "TRI Created", description: "Emergency Planning and Community Right-to-Know Act establishes the Toxics Release Inventory" },
  { year: 2000, label: "3M Exits PFOS", description: "3M announces phase-out of PFOS production after internal studies raise health concerns" },
  { year: 2016, label: "Flint Crisis", description: "Federal emergency declared in Flint, Michigan over lead-contaminated water" },
  { year: 2022, label: "Camp Lejeune Act", description: "Camp Lejeune Justice Act signed, enabling legal claims for water contamination victims" },
  { year: 2024, label: "PFAS Limits Set", description: "EPA establishes first-ever enforceable limits for PFAS in drinking water" },
];
