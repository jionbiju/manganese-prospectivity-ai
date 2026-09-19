import { useState, useEffect } from "react";
import { api } from "../api/endpoints";

export function useScenario() {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getScenarioModel();
        setModel(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load scenario model"));
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { model, loading, error };
}
