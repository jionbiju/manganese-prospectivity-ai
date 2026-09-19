import { useState } from "react";
import { useProspectivity } from "../hooks/useProspectivity";
import MapView from "../components/map/MapView";
import LayerPanel from "../components/map/LayerPanel";
import CellDrawer from "../components/map/CellDrawer";

export default function ExplorationMap() {
  const { prospectivity, occurrences, faults, leases, drillTargets, shap, loading, error } = useProspectivity();
  
  const [basemap, setBasemap] = useState<"osm" | "satellite" | "terrain">("osm");
  const [activeModel, setActiveModel] = useState<"p_wsm" | "p_rf" | "p_xgb">("p_xgb");
  const [opacity, setOpacity] = useState(0.7);
  const [threshold, setThreshold] = useState(0.3);
  const [continuousColors, setContinuousColors] = useState(false);
  const [colorblindSafe, setColorblindSafe] = useState(true);
  
  const [visibleLayers, setVisibleLayers] = useState({
    prospectivity: true,
    occurrences: true,
    leases: true,
    faults: true,
    drillTargets: true,
  });

  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  const toggleLayer = (layer: string) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !(prev as any)[layer] }));
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error loading map data: {error.message}
      </div>
    );
  }

  const selectedCellFeature = prospectivity?.features.find(f => f.id === selectedCellId) || null;
  const selectedCellShap = selectedCellId && shap ? shap[selectedCellId] : [];

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-100">
      <LayerPanel
        basemap={basemap}
        setBasemap={setBasemap}
        activeModel={activeModel}
        setActiveModel={setActiveModel}
        opacity={opacity}
        setOpacity={setOpacity}
        threshold={threshold}
        setThreshold={setThreshold}
        visibleLayers={visibleLayers}
        toggleLayer={toggleLayer}
        continuousColors={continuousColors}
        setContinuousColors={setContinuousColors}
        colorblindSafe={colorblindSafe}
        setColorblindSafe={setColorblindSafe}
      />
      
      <div className="flex-1 relative">
        <MapView
          prospectivity={prospectivity}
          occurrences={occurrences}
          faults={faults}
          leases={leases}
          drillTargets={drillTargets}
          basemap={basemap}
          activeModel={activeModel}
          opacity={opacity}
          threshold={threshold}
          visibleLayers={visibleLayers}
          continuousColors={continuousColors}
          colorblindSafe={colorblindSafe}
          onCellClick={(id) => setSelectedCellId(id)}
        />
        
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow">
              Loading spatial data...
            </div>
          </div>
        )}
      </div>

      <CellDrawer
        isOpen={!!selectedCellId}
        onClose={() => setSelectedCellId(null)}
        feature={selectedCellFeature}
        shapValues={selectedCellShap}
        activeModel={activeModel}
      />
    </div>
  );
}
