// ----------------------------------------------------------------------------
// Prospectivity Data
// ----------------------------------------------------------------------------

export interface ProspectivityProperties {
  id: string;
  p_wsm: number;
  p_rf: number;
  p_xgb: number;
  class: "low" | "medium" | "high";
  confidence: number;
  lithology: string;
  fault_dist_m: number;
  ndvi: number;
  ndmi: number;
  lst_c: number;
  slope_deg: number;
}

export interface ProspectivityFeature {
  type: "Feature";
  id?: string;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties: ProspectivityProperties;
}

export interface ProspectivityFeatureCollection {
  type: "FeatureCollection";
  features: ProspectivityFeature[];
}

// ----------------------------------------------------------------------------
// SHAP Values
// ----------------------------------------------------------------------------

export interface ShapValue {
  feature: string;
  value: number;
}

export interface ShapData {
  [cellId: string]: ShapValue[];
}

// ----------------------------------------------------------------------------
// Map Layers (Occurrences, Faults, Leases, Drill Targets)
// ----------------------------------------------------------------------------

export interface OccurrenceProperties {
  name: string;
  type: string;
}

export interface OccurrenceFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: OccurrenceProperties;
}

export interface OccurrenceFeatureCollection {
  type: "FeatureCollection";
  features: OccurrenceFeature[];
}

export interface FaultFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: Record<string, unknown>;
}

export interface FaultFeatureCollection {
  type: "FeatureCollection";
  features: FaultFeature[];
}

export interface LeaseProperties {
  "mine name": string;
}

export interface LeaseFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: LeaseProperties;
}

export interface LeaseFeatureCollection {
  type: "FeatureCollection";
  features: LeaseFeature[];
}

export interface DrillTarget {
  rank: number;
  lat: number;
  lng: number;
  score: number;
  rationale: string;
}

// ----------------------------------------------------------------------------
// Production Risk & Simulator
// ----------------------------------------------------------------------------

export interface MonthlyProduction {
  month: string;
  planned: number;
  predicted: number;
  lower: number;
  upper: number;
}

export interface ProductionDriver {
  factor: string;
  impact: number;
}

export interface MineProduction {
  id: string;
  name: string;
  months: MonthlyProduction[];
  shortfall_t: number;
  risk: "Low" | "Medium" | "High";
  drivers: ProductionDriver[];
}

export interface ProductionData {
  mines: MineProduction[];
}

export interface Alert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  mine: string;
  driver: string;
  date: string;
  message: string;
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // positive or negative percentage
  status?: "good" | "warning" | "critical";
}
