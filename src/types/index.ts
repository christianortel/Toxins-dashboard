// ============================================================
// EVIDENCE & LAYER TAXONOMY
// ============================================================

export type EvidenceLevel = "direct" | "proxy" | "screening" | "literature" | "editorial";
export type LayerGroupId = "official" | "emerging" | "wildlife" | "reproductive" | "regulatory";

/** Fine-grained layer type within a group */
export type LayerId =
  | "industrial_sites"
  | "toxic_releases"
  | "power_plants"
  | "hazardous_sites"
  | "pfas_sites"
  | "wastewater"
  | "sentinel_species"
  | "reproductive_regions"
  | "case_study_markers"
  | "legal_actions";

export interface LayerGroup {
  id: LayerGroupId;
  label: string;
  description: string;
  color: string;
}

export interface DataLayer {
  id: LayerId;
  group: LayerGroupId;
  label: string;
  description: string;
  evidenceLevel: EvidenceLevel;
  sourceIds: string[];
  enabled: boolean;
  entityCount: number;
}

// ============================================================
// UNIFIED MAP ENTITY
// ============================================================

/** Every item on the map conforms to this base shape */
export interface MapEntity {
  id: string;
  layerId: LayerId;
  layerGroup: LayerGroupId;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  county: string;
  evidenceLevel: EvidenceLevel;
  summary: string;
  year?: number;
  yearEnd?: number;
  sourceIds: string[];
  tags: string[];
  /** Optional typed payload for layer-specific data */
  meta: Record<string, unknown>;
}

// ============================================================
// LAYER-SPECIFIC INTERFACES
// ============================================================

export interface IndustrialSite extends MapEntity {
  layerId: "industrial_sites";
  meta: {
    facilityType: string;
    chemicals: string[];
    triId?: string;
    parentCompany?: string;
    operatingStatus: string;
  };
}

export interface PowerPlant extends MapEntity {
  layerId: "power_plants";
  meta: {
    fuelType: string;
    capacityMw: number;
    emissionsCo2Tons?: number;
    emissionsSo2Tons?: number;
    emissionsNoxTons?: number;
    operatingStatus: string;
  };
}

export interface PfasSite extends MapEntity {
  layerId: "pfas_sites";
  meta: {
    siteType: string;
    pfasCompounds: string[];
    maxConcentrationPpt?: number;
    mediumTested: string;
    affectedPopulation?: number;
  };
}

export interface HazardousSite extends MapEntity {
  layerId: "hazardous_sites";
  meta: {
    siteType: string;
    nplStatus?: string;
    contaminants: string[];
    cleanupStatus: string;
    hazardScore?: number;
  };
}

export interface WastewaterSite extends MapEntity {
  layerId: "wastewater";
  meta: {
    facilityType: string;
    designFlowMgd?: number;
    receivingWater: string;
    violationsCount: number;
    npdesPermit?: string;
  };
}

export interface SentinelRecord extends MapEntity {
  layerId: "sentinel_species";
  meta: {
    species: string;
    scientificName?: string;
    taxonGroup: string;
    observationType: string;
    severity: "low" | "moderate" | "high" | "critical";
    associatedContaminants: string[];
  };
}

export interface ReproductiveRegion extends MapEntity {
  layerId: "reproductive_regions";
  meta: {
    metric: string;
    value: number;
    unit: string;
    trend: "increasing" | "decreasing" | "stable" | "unknown";
    demographicGroup?: string;
  };
}

export interface CaseStudyMarker extends MapEntity {
  layerId: "case_study_markers";
  meta: {
    slug: string;
    subtitle: string;
    layerGroups: LayerGroupId[];
    keySignalCount: number;
  };
}

export interface LegalAction extends MapEntity {
  layerId: "legal_actions";
  meta: {
    actionType: string;
    agency: string;
    status: string;
    penaltyAmount?: number;
    description: string;
  };
}

/** Union of all map entity types */
export type AnyMapEntity =
  | IndustrialSite
  | PowerPlant
  | PfasSite
  | HazardousSite
  | WastewaterSite
  | SentinelRecord
  | ReproductiveRegion
  | CaseStudyMarker
  | LegalAction;

// ============================================================
// CASE STUDIES
// ============================================================

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  coordinates: [number, number];
  date: string;
  layerGroups: LayerGroupId[];
  evidenceLevel: EvidenceLevel;
  summary: string;
  body: string;
  keyFindings: string[];
  sources: SourceReference[];
  methodologyNote: string;
  imageUrl?: string;
}

// ============================================================
// SOURCE REGISTRY
// ============================================================

export interface SourceReference {
  id: string;
  name: string;
  shortName?: string;
  layerGroup: LayerGroupId;
  description: string;
  url?: string;
  lastUpdated: string;
  updateFrequency?: string;
  caveats: string;
  agency?: string;
  license?: string;
}

// ============================================================
// METHODOLOGY
// ============================================================

export interface MethodologySection {
  id: string;
  title: string;
  description: string;
  measures: string;
  doesNotMeasure: string;
  evidenceType: EvidenceLevel;
  uncertainties: string[];
}

export interface FeaturedStatistic {
  value: string;
  label: string;
  context: string;
  source: string;
  evidenceLevel: EvidenceLevel;
}

export interface TimelineEntry {
  year: number;
  label: string;
  description: string;
  layerGroup?: LayerGroupId;
}

// ============================================================
// SEARCH
// ============================================================

export interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  type: "entity" | "location" | "case_study";
  layerGroup?: LayerGroupId;
  coordinates?: [number, number];
  entityId?: string;
}
