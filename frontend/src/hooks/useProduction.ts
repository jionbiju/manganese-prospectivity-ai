import { useState, useEffect } from "react";
import { api } from "../api/endpoints";
import type { ProductionData, Alert } from "../types";

export function useProduction() {
  const [data, setData] = useState<{
    production: ProductionData | null;
    alerts: Alert[] | null;
  }>({
    production: null,
    alerts: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [production, alerts] = await Promise.all([
          api.getProduction(),
          api.getAlerts(),
        ]);
        
        setData({ production, alerts });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load production data"));
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { ...data, loading, error };
}
