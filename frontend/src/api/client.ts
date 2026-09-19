const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Core fetch client that handles routing requests to either the mock static files
 * or a real backend API, transparently to the rest of the application.
 */
export async function apiClient<T>(endpoint: string): Promise<T> {
  let url = "";

  if (USE_MOCK || !API_BASE) {
    // When using mock data, endpoint like "/prospectivity" maps to "/data/prospectivity.geojson"
    // We map .geojson and .json based on the endpoint name
    const geojsonEndpoints = ["prospectivity", "occurrences", "faults", "leases"];
    const ext = geojsonEndpoints.includes(endpoint) ? "geojson" : "json";
    url = `/data/${endpoint}.${ext}`;
  } else {
    // Real backend
    url = `${API_BASE}/api/v1/${endpoint}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}
