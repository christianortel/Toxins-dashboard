import type { SourceReference } from "@/types";

export const mockSources: SourceReference[] = [
  {
    id: "tri",
    name: "EPA Toxics Release Inventory (TRI)",
    layerGroup: "official",
    description:
      "Annual reporting of toxic chemical releases and waste management by industrial facilities. Covers over 21,000 facilities across the United States.",
    url: "https://www.epa.gov/toxics-release-inventory-tri-program",
    lastUpdated: "2024-01-15",
    caveats:
      "Self-reported by facilities. Covers only listed chemicals above reporting thresholds. Does not include all industrial sectors.",
    agency: "EPA",
  },
  {
    id: "superfund",
    name: "EPA Superfund / NPL Sites",
    layerGroup: "official",
    description:
      "National Priorities List of the most contaminated hazardous waste sites in the country, prioritized for long-term cleanup.",
    url: "https://www.epa.gov/superfund",
    lastUpdated: "2024-02-01",
    caveats:
      "NPL listing involves a lengthy evaluation process. Many contaminated sites are not yet listed or assessed.",
    agency: "EPA",
  },
  {
    id: "pfas-testing",
    name: "EPA PFAS Analytical Methods & Occurrence Data",
    layerGroup: "emerging",
    description:
      "PFAS detection data from the fifth Unregulated Contaminant Monitoring Rule (UCMR 5) and other testing programs.",
    url: "https://www.epa.gov/pfas",
    lastUpdated: "2024-03-01",
    caveats:
      "Testing methods continue to evolve. Many PFAS compounds lack established analytical methods. Coverage varies significantly by region.",
    agency: "EPA",
  },
  {
    id: "usgs-endocrine",
    name: "USGS Endocrine Disruption Studies",
    layerGroup: "wildlife",
    description:
      "Research on endocrine-disrupting chemicals in waterways and their effects on fish and wildlife reproductive systems.",
    url: "https://www.usgs.gov/mission-areas/environmental-health",
    lastUpdated: "2023-11-15",
    caveats:
      "Study coverage is not nationally comprehensive. Research findings do not directly establish human health risk levels.",
    agency: "USGS",
  },
  {
    id: "cdc-reproductive",
    name: "CDC National Center for Health Statistics — Reproductive Health",
    layerGroup: "reproductive",
    description:
      "National survey data on fertility rates, birth outcomes, and reproductive health indicators across U.S. populations.",
    url: "https://www.cdc.gov/nchs/",
    lastUpdated: "2024-01-01",
    caveats:
      "Population-level data cannot establish environmental causation. Trends are influenced by multiple social, economic, and behavioral factors.",
    agency: "CDC",
  },
  {
    id: "sperm-meta",
    name: "Sperm Count Meta-Analyses (Levine et al.)",
    layerGroup: "reproductive",
    description:
      "Published meta-analyses tracking global trends in sperm concentration and total sperm count over several decades.",
    lastUpdated: "2023-06-01",
    caveats:
      "Meta-analyses aggregate heterogeneous studies. Regional variation is significant. Causation for observed decline is debated.",
    agency: "Academic Research",
  },
  {
    id: "echo-enforcement",
    name: "EPA ECHO Enforcement & Compliance Data",
    layerGroup: "regulatory",
    description:
      "Enforcement actions, compliance evaluations, and violation data for EPA-regulated facilities.",
    url: "https://echo.epa.gov",
    lastUpdated: "2024-02-15",
    caveats:
      "Enforcement actions represent only a fraction of violations. Data quality depends on state reporting consistency.",
    agency: "EPA",
  },
  {
    id: "sentinel-amphibians",
    name: "North American Amphibian Monitoring Program",
    layerGroup: "wildlife",
    description:
      "Long-term monitoring of amphibian populations, including deformity tracking and population trend analysis.",
    lastUpdated: "2023-09-01",
    caveats:
      "Volunteer-based monitoring has coverage gaps. Deformity causes are multifactorial and site-specific.",
    agency: "USGS / Partners",
  },
];
