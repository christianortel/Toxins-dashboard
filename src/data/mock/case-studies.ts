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
  },
];
