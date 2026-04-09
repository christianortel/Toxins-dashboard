import type { CaseStudy } from "@/types";

export const mockCaseStudies: CaseStudy[] = [
  {
    slug: "ohio-river-valley-chemical-corridor",
    title: "The Chemical Corridor",
    subtitle: "Ohio River Valley's legacy of industrial contamination and downstream health signals",
    location: "Ohio River Valley, WV–OH–KY",
    coordinates: [-81.63, 39.33],
    date: "2024-03-15",
    layerGroups: ["official", "emerging", "reproductive"],
    evidenceLevel: "direct",
    summary:
      "The Ohio River Valley contains one of the densest concentrations of chemical manufacturing in the United States. Communities downstream of major facilities report elevated rates of certain cancers and reproductive health concerns, though establishing direct causation remains scientifically complex.",
    body: `The stretch of the Ohio River running through West Virginia, Ohio, and Kentucky has hosted chemical manufacturing since the early twentieth century. DuPont's Washington Works facility near Parkersburg, WV became the epicenter of one of the most significant PFAS contamination cases in U.S. history.

C8 (PFOA), used in the production of Teflon, was discharged into the Ohio River for decades before its health effects were widely acknowledged. The C8 Science Panel, established as part of a class-action settlement, linked PFOA exposure to six disease categories including kidney cancer, testicular cancer, and thyroid disease.

Today, the valley remains home to dozens of active TRI-reporting facilities. Downstream communities continue to raise concerns about cumulative exposure from multiple industrial sources, legacy contamination in soil and groundwater, and the adequacy of current regulatory thresholds.`,
    keyFindings: [
      "Over 40 TRI-reporting facilities within a 50-mile corridor",
      "PFOA detected in drinking water supplies serving 70,000+ residents",
      "C8 Science Panel established probable links to six disease categories",
      "Legacy contamination persists in groundwater decades after production changes",
      "Cumulative exposure from multiple facilities remains unassessed by regulators",
    ],
    sources: [
      {
        id: "src-c8-panel",
        name: "C8 Science Panel Reports",
        layerGroup: "emerging",
        description: "Independent science panel findings on PFOA health effects",
        url: "http://www.c8sciencepanel.org",
        lastUpdated: "2023-12-01",
        caveats: "Panel assessed probable links, not definitive causation",
        agency: "Independent Panel",
      },
    ],
    methodologyNote:
      "This case study draws on a combination of EPA TRI emissions data, the published findings of the C8 Science Panel, ATSDR health assessments, and reporting from Bilott (2019) and Lerner (2018). All cited cancer rates reflect age-adjusted county-level statistics from CDC WONDER. Causation between specific facility emissions and individual health outcomes is not claimed; the case study presents documented correlations alongside their original uncertainty ranges.",
  },
  {
    slug: "flint-river-sentinel-species",
    title: "Sentinels in the Flint",
    subtitle: "What fish and frogs signaled before the water crisis became national news",
    location: "Flint River Basin, Michigan",
    coordinates: [-83.69, 43.01],
    date: "2024-01-22",
    layerGroups: ["wildlife", "official", "regulatory"],
    evidenceLevel: "proxy",
    summary:
      "Years before Flint's water crisis made headlines, biologists documented abnormalities in aquatic species throughout the Flint River system. Intersex fish, amphibian deformities, and declining mussel populations may have been early signals of the broader contamination that would eventually affect the city's drinking water.",
    body: `The Flint River has a long history of industrial use and contamination. Before the city of Flint switched its water source to the river in 2014, triggering the widely-reported lead crisis, the river was already impaired under the Clean Water Act for multiple pollutants.

Biologists from Michigan's Department of Natural Resources had documented elevated rates of intersex characteristics in smallmouth bass as early as 2008. Amphibian surveys noted limb deformities in several species at rates exceeding regional baselines. Freshwater mussel populations — long considered sensitive indicators of water quality — had declined significantly in several tributaries.

These biological signals, while not directly predicting the lead crisis, illustrate a broader pattern: aquatic organisms often respond to environmental degradation before regulatory systems detect or act on the problem. The Flint case raises questions about whether more systematic sentinel species monitoring could serve as an early-warning system for environmental health threats.`,
    keyFindings: [
      "Intersex fish documented in Flint River years before the water crisis",
      "Amphibian deformity rates exceeded regional baselines by 3-4x",
      "Freshwater mussel populations declined 60% over two decades",
      "River was already CWA-impaired before being used as drinking water source",
      "Biological signals preceded regulatory action by several years",
    ],
    sources: [
      {
        id: "src-mdnr-fish",
        name: "Michigan DNR Fish Surveys",
        layerGroup: "wildlife",
        description: "State fish health and population surveys",
        lastUpdated: "2023-06-15",
        caveats: "Survey coverage varies by year and funding",
        agency: "Michigan DNR",
      },
    ],
    methodologyNote:
      "This case study cites Michigan DNR survey records, USGS endocrine disruption studies in the Great Lakes basin, and post-crisis epidemiological reports from MDHHS. Wildlife abnormalities are presented as proxy indicators of environmental stress, not as direct evidence of human health risk. Establishing a causal chain from biological signal to public-health outcome is beyond the scope of available data.",
  },
  {
    slug: "camp-lejeune-reproductive-legacy",
    title: "The Reproductive Legacy of Camp Lejeune",
    subtitle: "Decades of contaminated water and the long shadow on military families",
    location: "Camp Lejeune, North Carolina",
    coordinates: [-77.39, 34.67],
    date: "2024-05-10",
    layerGroups: ["official", "reproductive", "regulatory"],
    evidenceLevel: "direct",
    summary:
      "From the 1950s through the 1980s, drinking water at Camp Lejeune was contaminated with industrial solvents and other chemicals. Epidemiological studies have since linked exposure to increased risks of certain cancers, birth defects, and adverse reproductive outcomes among Marines and their families.",
    body: `Camp Lejeune, one of the largest Marine Corps bases in the United States, provided contaminated drinking water to as many as one million people over three decades. The primary contaminants — trichloroethylene (TCE), perchloroethylene (PCE), benzene, and vinyl chloride — entered the water supply from on-base dry cleaning operations, underground fuel storage tanks, and an off-base waste disposal site.

The Agency for Toxic Substances and Disease Registry (ATSDR) conducted multiple studies linking exposure to Camp Lejeune water to adverse health outcomes including male breast cancer, bladder cancer, kidney cancer, and leukemia. Studies also found elevated risks of neural tube defects and low birth weight among children born to exposed mothers.

In 2022, the Camp Lejeune Justice Act opened the door for affected individuals to pursue legal claims. The case represents one of the most extensively documented examples of military environmental contamination affecting reproductive and developmental health.`,
    keyFindings: [
      "Up to 1 million people exposed to contaminated water over 30 years",
      "TCE levels exceeded safety limits by 215x at peak contamination",
      "ATSDR studies found elevated risks for multiple cancer types",
      "Neural tube defects and low birth weight linked to maternal exposure",
      "2022 Camp Lejeune Justice Act enabled legal claims for affected families",
    ],
    sources: [
      {
        id: "src-atsdr-cl",
        name: "ATSDR Camp Lejeune Studies",
        layerGroup: "official",
        description: "Federal health assessments and epidemiological studies",
        url: "https://www.atsdr.cdc.gov/sites/lejeune/",
        lastUpdated: "2024-01-15",
        caveats: "Some exposure reconstructions rely on modeling rather than direct measurement",
        agency: "ATSDR / CDC",
      },
    ],
    methodologyNote:
      "This case study summarizes findings from ATSDR's Camp Lejeune cohort studies, the National Academies' 2009 review, and the legal record of the Camp Lejeune Justice Act. Historical TCE and PCE concentrations are reconstructed via the ATSDR groundwater model, which carries known uncertainty. Statistical associations between exposure and disease are presented as published, with confidence intervals retained where available.",
  },
  {
    slug: "great-lakes-pfas-contamination",
    title: "Forever Chemicals in the Great Lakes",
    subtitle: "PFAS contamination across the largest freshwater system on Earth",
    location: "Great Lakes Region, US–Canada",
    coordinates: [-84.35, 44.76],
    date: "2024-07-08",
    layerGroups: ["emerging", "wildlife", "official"],
    evidenceLevel: "direct",
    summary:
      "The Great Lakes, holding 21% of the world's surface fresh water, face widespread PFAS contamination from military bases, industrial facilities, and wastewater treatment plants. Emerging research documents PFAS accumulation in fish, birds, and drinking water supplies serving millions.",
    body: `Per- and polyfluoroalkyl substances (PFAS) have been detected across the Great Lakes basin at levels that concern scientists, regulators, and communities. These persistent chemicals, used in firefighting foam, nonstick coatings, and industrial processes, resist natural degradation and accumulate in both the environment and biological organisms.

Michigan alone has identified over 200 PFAS contamination sites, many associated with military installations and manufacturing facilities. Studies have documented PFAS in the blood of Great Lakes fish at levels exceeding consumption advisory thresholds. Bald eagles and other apex predators show measurable PFAS burdens, raising questions about biomagnification through the food web.

Drinking water systems serving millions of residents across eight states and two Canadian provinces face the challenge of monitoring and treating for compounds that existing infrastructure was not designed to address. The scale of PFAS contamination in the Great Lakes region represents one of the most significant emerging environmental health challenges in North America.`,
    keyFindings: [
      "200+ identified PFAS sites in Michigan alone",
      "PFAS detected in fish tissue at levels exceeding consumption advisories",
      "Drinking water systems serving 30M+ people face PFAS monitoring challenges",
      "Biomagnification documented in Great Lakes food web",
      "Current wastewater treatment does not effectively remove PFAS",
    ],
    sources: [
      {
        id: "src-epa-pfas-gl",
        name: "EPA Great Lakes PFAS Monitoring",
        layerGroup: "emerging",
        description: "Federal monitoring data for PFAS in Great Lakes waters",
        lastUpdated: "2024-03-01",
        caveats: "Monitoring coverage is improving but not yet comprehensive",
        agency: "EPA",
      },
    ],
    methodologyNote:
      "This case study compiles PFAS detection data from EPA UCMR 5, state-level disclosure portals (notably Michigan's MPART), Environmental Working Group's Tap Water Database, and peer-reviewed bioaccumulation studies. PFAS concentrations across the Great Lakes basin are not uniformly sampled; gaps in coverage are noted where applicable. The case study does not extrapolate human health risk from environmental burden alone.",
  },
  {
    slug: "cancer-alley-corridor",
    title: "Cancer Alley",
    subtitle: "An 85-mile petrochemical corridor on the lower Mississippi River",
    location: "St. James Parish, Louisiana",
    coordinates: [-90.7769, 30.0988],
    date: "2024-09-12",
    layerGroups: ["official", "reproductive", "emerging"],
    evidenceLevel: "screening",
    summary:
      "The stretch of the Mississippi River between Baton Rouge and New Orleans hosts more than 150 petrochemical and refining facilities. Surrounding parishes — overwhelmingly Black, often economically distressed — report cancer incidence and respiratory illness rates among the highest in the country, in patterns that have drawn federal civil rights scrutiny.",
    body: `The 85 miles of river road between Baton Rouge and New Orleans concentrate one of the densest petrochemical clusters on Earth. Roughly 150 plants — refineries, plastic feedstock producers, chlorine plants, fertilizer manufacturers — operate within communities that long predate them. Many of these communities are descended from formerly enslaved people who founded freedom settlements in the 1860s.
\nA 2021 EPA risk assessment identified census tracts in the corridor where lifetime cancer risk from air toxics exceeded national thresholds by an order of magnitude. The agency's modeling pointed to ethylene oxide and chloroprene — produced by the Denka Performance Elastomer plant in Reserve, LA — as primary contributors. Subsequent research from Tulane University found preterm birth rates in the corridor running well above state and national averages, even after controlling for poverty.
\nThe story of Cancer Alley does not reduce to a single facility, contaminant, or class action. It is the cumulative result of decades of land use, regulatory deference, and the patchwork science of cumulative chemical exposure — a question modern toxicology has only recently begun to address with any seriousness.`,
    keyFindings: [
      "150+ petrochemical and refining facilities along an 85-mile river corridor",
      "EPA modeled cancer risk in some tracts >50× the national average",
      "Preterm birth rates in corridor parishes 25-40% above state baseline",
      "Federal Title VI civil rights investigation opened in 2022",
      "Cumulative exposure from multiple facilities is not assessed by any single regulator",
    ],
    sources: [
      {
        id: "src-epa-airtox",
        name: "EPA Air Toxics Assessment",
        layerGroup: "official",
        description: "Modeled cancer risk and respiratory hazard from air toxics by census tract",
        url: "https://www.epa.gov/AirToxScreen",
        lastUpdated: "2024-02-01",
        caveats: "Risk values are modeled, not measured; uncertainty grows with smaller geographies",
        agency: "EPA",
      },
    ],
    methodologyNote:
      "This case study integrates EPA AirToxScreen modeled risk values, Louisiana Tumor Registry incidence data, peer-reviewed Tulane research on preterm birth, and the public record of Title VI complaints filed against the Louisiana DEQ. Modeled risk and observed health outcomes use different methodologies and cannot be directly cross-validated; we present each on its own terms with original confidence ranges retained.",
  },
  {
    slug: "atrazine-question",
    title: "The Atrazine Question",
    subtitle: "A herbicide, an endocrinologist, and the fight over what counts as evidence",
    location: "Midwest agricultural region, USA",
    coordinates: [-93.5, 41.5],
    date: "2024-11-04",
    layerGroups: ["wildlife", "reproductive", "regulatory"],
    evidenceLevel: "literature",
    summary:
      "Atrazine is one of the most widely used herbicides in U.S. agriculture and one of the most studied endocrine-disrupting compounds in modern toxicology. Two decades of laboratory and field research have built a body of evidence linking it to reproductive abnormalities in amphibians and to subtler effects in mammals — yet it remains legal in the United States while banned across the European Union since 2004.",
    body: `Atrazine has been applied to American corn fields since 1958. Today, roughly 70 million pounds are used annually, primarily across the Midwest. It is also one of the most frequently detected pesticides in U.S. surface and drinking water.
\nThe scientific case against atrazine took shape after Berkeley endocrinologist Tyrone Hayes published a 2002 study showing that exposure to environmentally relevant concentrations caused gonadal abnormalities in male African clawed frogs. The findings were politically explosive: Hayes had originally been hired by Syngenta, the manufacturer, to evaluate the chemical's safety. He has since described being subjected to a sustained pressure campaign aimed at suppressing his findings.
\nMultiple independent studies have replicated and extended the amphibian results. Epidemiological work has reported associations between atrazine exposure and adverse human reproductive outcomes, including reduced sperm quality and increased risk of certain birth defects, though confounders complicate causal inference. The European Union banned atrazine in 2004 on the precautionary principle. The U.S. EPA, citing different evidentiary standards, has reauthorized it with conditions.
\nThe Atrazine Question is, at its core, a question about how regulatory science weighs ecological signals against epidemiological uncertainty — and what burden of proof a society demands before acting.`,
    keyFindings: [
      "70+ million pounds of atrazine applied annually across U.S. cropland",
      "Reproductive and gonadal abnormalities documented in multiple amphibian species",
      "Banned in the European Union since 2004 under the precautionary principle",
      "Reauthorized by U.S. EPA with mitigation measures, most recently in 2020",
      "Epidemiological evidence remains contested; replication studies are ongoing",
    ],
    sources: [
      {
        id: "src-hayes-atrazine",
        name: "Hayes et al. — Atrazine Endocrine Studies",
        layerGroup: "wildlife",
        description: "Peer-reviewed studies of atrazine effects on amphibian reproductive development",
        lastUpdated: "2010-03-01",
        caveats: "Findings remain disputed by industry-funded studies",
        agency: "Academic Research",
      },
      {
        id: "src-epa-atrazine",
        name: "EPA Atrazine Risk Assessment",
        layerGroup: "regulatory",
        description: "Federal risk assessments and reregistration documents",
        url: "https://www.epa.gov/ingredients-used-pesticide-products/atrazine",
        lastUpdated: "2023-09-15",
        caveats: "Industry-submitted studies are weighted alongside academic literature",
        agency: "EPA",
      },
    ],
    methodologyNote:
      "This case study draws on peer-reviewed amphibian studies (notably Hayes 2002, 2010), epidemiological reviews from Beane Freeman and others, EPA's atrazine reregistration record, and the European Food Safety Authority's 2003 risk assessment. The case is not presented as a settled question; we summarize the evidentiary disagreement between U.S. and EU regulators and the methodological reasons each cite for their position.",
  },
];
