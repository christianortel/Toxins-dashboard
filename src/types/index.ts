export type EvidenceLevel = "direct" | "proxy" | "screening" | "literature" | "editorial";
export type LayerGroupId = "official" | "emerging" | "wildlife" | "reproductive" | "regulatory";

export interface LayerGroup {
  id: LayerGroupId;
  label: string;
  description: string;
  color: string;
}

export interface DataLayer {
  id: string;
  group: LayerGroupId;
  label: string;
  description: string;
  evidenceLevel: EvidenceLevel;
  sourceCount: number;
  enabled: boolean;
}

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
  imageUrl?: string;
}

export interface SourceReference {
  id: string;
  name: string;
  layerGroup: LayerGroupId;
  description: string;
  url?: string;
  lastUpdated: string;
  caveats: string;
  agency?: string;
}

export interface IndustrialSite {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  state: string;
  county: string;
  layerGroup: LayerGroupId;
  evidenceLevel: EvidenceLevel;
  description: string;
  chemicals?: string[];
  year?: number;
}

export interface ReproductiveIndicator {
  id: string;
  region: string;
  metric: string;
  value: number;
  unit: string;
  year: number;
  trend: "increasing" | "decreasing" | "stable" | "unknown";
  evidenceLevel: EvidenceLevel;
  source: string;
}

export interface SentinelRecord {
  id: string;
  species: string;
  location: string;
  coordinates: [number, number];
  observation: string;
  year: number;
  evidenceLevel: EvidenceLevel;
  associatedContaminants?: string[];
}

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
