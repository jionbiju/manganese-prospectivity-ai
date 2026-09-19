import { useState, useEffect } from "react";
import { api } from "../api/endpoints";
import type { KPI, Alert, DrillTarget, ProductionData, ProspectivityFeatureCollection } from "../types";

export function useDashboard() {
  const [data, setData] = useState<{
    kpis: KPI[] | null;
    alerts: Alert[] | null;
    drillTargets: DrillTarget[] | null;
    production: ProductionData | null;
    prospectivity: ProspectivityFeatureCollection | null;
  }>({
    kpis: null,
    alerts: null,
    drillTargets: null,
    production: null,
    prospectivity: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [kpis, alerts, drillTargets, production, prospectivity] = await Promise.all([
          api.getKpis(),
          api.getAlerts(),
          api.getDrillTargets(),
          api.getProduction(),
          api.getProspectivity(),
        ]);
        
        setData({ kpis, alerts, drillTargets, production, prospectivity });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load dashboard data"));
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { ...data, loading, error };
}
