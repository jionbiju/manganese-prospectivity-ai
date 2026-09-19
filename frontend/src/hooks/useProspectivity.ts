import { useState, useEffect } from "react";
import { api } from "../api/endpoints";
import type {
  ProspectivityFeatureCollection,
  OccurrenceFeatureCollection,
  FaultFeatureCollection,
  LeaseFeatureCollection,
  DrillTarget,
  ShapData
} from "../types";

export function useProspectivity() {
  const [data, setData] = useState<{
    prospectivity: ProspectivityFeatureCollection | null;
    occurrences: OccurrenceFeatureCollection | null;
    faults: FaultFeatureCollection | null;
    leases: LeaseFeatureCollection | null;
    drillTargets: DrillTarget[] | null;
    shap: ShapData | null;
  }>({
    prospectivity: null,
    occurrences: null,
    faults: null,
    leases: null,
    drillTargets: null,
    shap: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          prospectivity,
          occurrences,
          faults,
          leases,
          drillTargets,
          shap
        ] = await Promise.all([
          api.getProspectivity(),
          api.getOccurrences(),
          api.getFaults(),
          api.getLeases(),
          api.getDrillTargets(),
          api.getShap(),
        ]);
        
        setData({
          prospectivity,
          occurrences,
          faults,
          leases,
          drillTargets,
          shap
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load map data"));
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { ...data, loading, error };
}
