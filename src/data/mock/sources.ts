import type { SourceReference } from "@/types";

export const mockSources: SourceReference[] = [
  {
    id: "tri",
    name: "EPA Toxics Release Inventory (TRI)",
    shortName: "TRI",
    layerGroup: "official",
    description:
      "Annual reporting of toxic chemical releases and waste management by industrial facilities. Covers over 21,000 facilities across the United States.",
    url: "https://www.epa.gov/toxics-release-inventory-tri-program",
    lastUpdated: "2024-01-15",
    updateFrequency: "Annual",
    caveats:
      "Self-reported by facilities. Covers only listed chemicals above reporting thresholds. Does not include all industrial sectors.",
    agency: "EPA",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "superfund",
    name: "EPA Superfund / NPL Sites",
    shortName: "Superfund",
    layerGroup: "official",
    description:
      "National Priorities List of the most contaminated hazardous waste sites in the country, prioritized for long-term cleanup.",
    url: "https://www.epa.gov/superfund",
    lastUpdated: "2024-02-01",
    updateFrequency: "Quarterly",
    caveats:
      "NPL listing involves a lengthy evaluation process. Many contaminated sites are not yet listed or assessed.",
    agency: "EPA",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "pfas-testing",
    name: "EPA PFAS Analytical Methods & Occurrence Data",
    shortName: "EPA PFAS",
    layerGroup: "emerging",
    description:
      "PFAS detection data from the fifth Unregulated Contaminant Monitoring Rule (UCMR 5) and other testing programs.",
    url: "https://www.epa.gov/pfas",
    lastUpdated: "2024-03-01",
    updateFrequency: "Quarterly",
    caveats:
      "Testing methods continue to evolve. Many PFAS compounds lack established analytical methods. Coverage varies significantly by region.",
    agency: "EPA",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "usgs-endocrine",
    name: "USGS Endocrine Disruption Studies",
    shortName: "USGS Endo",
    layerGroup: "wildlife",
    description:
      "Research on endocrine-disrupting chemicals in waterways and their effects on fish and wildlife reproductive systems.",
    url: "https://www.usgs.gov/mission-areas/environmental-health",
    lastUpdated: "2023-11-15",
    updateFrequency: "Continuous",
    caveats:
      "Study coverage is not nationally comprehensive. Research findings do not directly establish human health risk levels.",
    agency: "USGS",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "cdc-reproductive",
    name: "CDC National Center for Health Statistics — Reproductive Health",
    shortName: "CDC NCHS",
    layerGroup: "reproductive",
    description:
      "National survey data on fertility rates, birth outcomes, and reproductive health indicators across U.S. populations.",
    url: "https://www.cdc.gov/nchs/",
    lastUpdated: "2024-01-01",
    updateFrequency: "Annual",
    caveats:
      "Population-level data cannot establish environmental causation. Trends are influenced by multiple social, economic, and behavioral factors.",
    agency: "CDC",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "sperm-meta",
    name: "Sperm Count Meta-Analyses (Levine et al.)",
    shortName: "Levine 2017/2023",
    layerGroup: "reproductive",
    description:
      "Published meta-analyses tracking global trends in sperm concentration and total sperm count over several decades.",
    lastUpdated: "2023-06-01",
    updateFrequency: "Periodic",
    caveats:
      "Meta-analyses aggregate heterogeneous studies. Regional variation is significant. Causation for observed decline is debated.",
    agency: "Academic Research",
    license: "Subject to publisher license",
  },
  {
    id: "echo-enforcement",
    name: "EPA ECHO Enforcement & Compliance Data",
    shortName: "ECHO",
    layerGroup: "regulatory",
    description:
      "Enforcement actions, compliance evaluations, and violation data for EPA-regulated facilities.",
    url: "https://echo.epa.gov",
    lastUpdated: "2024-02-15",
    updateFrequency: "Weekly",
    caveats:
      "Enforcement actions represent only a fraction of violations. Data quality depends on state reporting consistency.",
    agency: "EPA",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "sentinel-amphibians",
    name: "North American Amphibian Monitoring Program",
    shortName: "NAAMP",
    layerGroup: "wildlife",
    description:
      "Long-term monitoring of amphibian populations, including deformity tracking and population trend analysis.",
    lastUpdated: "2023-09-01",
    updateFrequency: "Annual",
    caveats:
      "Volunteer-based monitoring has coverage gaps. Deformity causes are multifactorial and site-specific.",
    agency: "USGS / Partners",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "ucmr5",
    name: "Unregulated Contaminant Monitoring Rule 5 (UCMR 5)",
    shortName: "UCMR 5",
    layerGroup: "emerging",
    description:
      "Nationwide monitoring program collecting occurrence data for 29 PFAS compounds and lithium in public drinking water systems serving 3,300+ people. Sampling underway through 2025.",
    url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule",
    lastUpdated: "2024-04-01",
    updateFrequency: "Quarterly",
    caveats:
      "Detection limits vary by analytical method. Smaller systems are sampled on a representative basis only. Initial data releases are subject to revision.",
    agency: "EPA Office of Water",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "echo-air",
    name: "EPA AirToxScreen",
    shortName: "AirToxScreen",
    layerGroup: "official",
    description:
      "Modeled estimates of cancer risk and respiratory hazard from outdoor air toxics by census tract, derived from National Emissions Inventory data and dispersion modeling.",
    url: "https://www.epa.gov/AirToxScreen",
    lastUpdated: "2024-02-01",
    updateFrequency: "Triennial",
    caveats:
      "Risk values are modeled estimates, not measurements. Uncertainty grows with smaller geographies and rare chemicals. Background concentrations are excluded.",
    agency: "EPA Office of Air Quality Planning and Standards",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "nces-birth",
    name: "CDC WONDER — Natality and Birth Outcomes",
    shortName: "CDC WONDER",
    layerGroup: "reproductive",
    description:
      "Public-use birth certificate data including preterm birth, low birth weight, congenital anomalies, and fetal death records aggregated by county and demographic group.",
    url: "https://wonder.cdc.gov",
    lastUpdated: "2024-01-01",
    updateFrequency: "Annual",
    caveats:
      "Suppressed for cells with fewer than 10 events to protect privacy. Birth certificate data quality varies by jurisdiction.",
    agency: "CDC National Center for Health Statistics",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "ewg-tap",
    name: "EWG Tap Water Database",
    shortName: "EWG Tap",
    layerGroup: "emerging",
    description:
      "Aggregated drinking water quality data from utility-reported testing, with health-based benchmarks reflecting current peer-reviewed science rather than regulatory limits.",
    url: "https://www.ewg.org/tapwater/",
    lastUpdated: "2024-03-15",
    updateFrequency: "Annual",
    caveats:
      "Health-based benchmarks reflect EWG's interpretation of current science and may differ from federal regulatory limits. Data quality depends on utility reporting.",
    agency: "Environmental Working Group",
    license: "Proprietary (publicly accessible)",
  },
  {
    id: "atsdr-hazsub",
    name: "ATSDR Hazardous Substances Database",
    shortName: "ATSDR HazDat",
    layerGroup: "official",
    description:
      "Site-specific contamination, exposure, and health assessment records from the Agency for Toxic Substances and Disease Registry's investigations of Superfund and other hazardous sites.",
    url: "https://www.atsdr.cdc.gov",
    lastUpdated: "2023-12-01",
    updateFrequency: "Continuous",
    caveats:
      "Health assessments often rely on modeled exposure reconstructions. Coverage prioritizes sites with documented community concerns.",
    agency: "ATSDR / CDC",
    license: "Public Domain (US Government Work)",
  },
  {
    id: "egrid",
    name: "EPA eGRID — Emissions & Generation Resource Integrated Database",
    shortName: "eGRID",
    layerGroup: "official",
    description:
      "Comprehensive source of data on the environmental characteristics of nearly all electric power generated in the United States, including CO2, NOx, SO2, and mercury emissions per power plant.",
    url: "https://www.epa.gov/egrid",
    lastUpdated: "2024-02-15",
    updateFrequency: "Annual",
    caveats:
      "Data lags by approximately 2 years. Distributed generation and behind-the-meter sources are excluded.",
    agency: "EPA Clean Air Markets Division",
    license: "Public Domain (US Government Work)",
  },
];
