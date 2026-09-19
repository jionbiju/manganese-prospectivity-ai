import { apiClient } from "./client";
import type {
  ProspectivityFeatureCollection,
  OccurrenceFeatureCollection,
  FaultFeatureCollection,
  LeaseFeatureCollection,
  DrillTarget,
  ProductionData,
  Alert,
  KPI,
  ShapData
} from "../types";

export const api = {
  getProspectivity: () => apiClient<ProspectivityFeatureCollection>("prospectivity"),
  getOccurrences: () => apiClient<OccurrenceFeatureCollection>("occurrences"),
  getFaults: () => apiClient<FaultFeatureCollection>("faults"),
  getLeases: () => apiClient<LeaseFeatureCollection>("leases"),
  getDrillTargets: () => apiClient<DrillTarget[]>("drill_targets"),
  getProduction: () => apiClient<ProductionData>("production"),
  getAlerts: () => apiClient<Alert[]>("alerts"),
  getKpis: () => apiClient<KPI[]>("kpis"),
  getShap: () => apiClient<ShapData>("shap"),
  getScenarioModel: () => apiClient<any>("scenario_model"),
};
