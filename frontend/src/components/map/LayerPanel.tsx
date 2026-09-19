import { Layers, Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

interface Props {
  basemap: "osm" | "satellite" | "terrain";
  setBasemap: (v: "osm" | "satellite" | "terrain") => void;
  activeModel: "p_wsm" | "p_rf" | "p_xgb";
  setActiveModel: (v: "p_wsm" | "p_rf" | "p_xgb") => void;
  opacity: number;
  setOpacity: (v: number) => void;
  threshold: number;
  setThreshold: (v: number) => void;
  visibleLayers: Record<string, boolean>;
  toggleLayer: (layer: keyof Props["visibleLayers"]) => void;
  continuousColors: boolean;
  setContinuousColors: (v: boolean) => void;
  colorblindSafe: boolean;
  setColorblindSafe: (v: boolean) => void;
}

export default function LayerPanel({
  basemap, setBasemap,
  activeModel, setActiveModel,
  opacity, setOpacity,
  threshold, setThreshold,
  visibleLayers, toggleLayer,
  continuousColors, setContinuousColors,
  colorblindSafe, setColorblindSafe
}: Props) {
  return (
    <div className="w-80 h-full bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2 font-semibold text-slate-800">
        <Layers className="w-5 h-5 text-brand-600" />
        Map Controls
      </div>
      
      <div className="p-4 space-y-6">
        {/* Basemap */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Basemap</h3>
          <div className="flex bg-slate-100 rounded-md p-1">
            {["osm", "satellite", "terrain"].map(b => (
              <button
                key={b}
                onClick={() => setBasemap(b as any)}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-sm capitalize font-medium transition-colors",
                  basemap === b ? "bg-white shadow text-brand-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Model Inference</h3>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value as any)}
            className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="p_xgb">XGBoost (High Accuracy)</option>
            <option value="p_rf">Random Forest (Robust)</option>
            <option value="p_wsm">Weights of Evidence (Baseline)</option>
          </select>
        </div>

        {/* Prospectivity Styling */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Prospectivity</h3>
            <button onClick={() => toggleLayer("prospectivity")}>
              {visibleLayers.prospectivity ? <Eye className="w-4 h-4 text-brand-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
          
          {visibleLayers.prospectivity && (
            <div className="pl-2 border-l-2 border-slate-100 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Threshold</span>
                  <span>{threshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Opacity</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={continuousColors}
                    onChange={(e) => setContinuousColors(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  Continuous color ramp
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={colorblindSafe}
                    onChange={(e) => setColorblindSafe(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  Colorblind-safe palette
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Feature Layers */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Feature Layers</h3>
          <div className="space-y-2">
            {[
              { id: "occurrences", label: "Known Mn Occurrences" },
              { id: "faults", label: "Structural Faults" },
              { id: "leases", label: "MOIL Mine Leases" },
              { id: "drillTargets", label: "Suggested Drill Targets" },
            ].map(layer => (
              <label key={layer.id} className="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
                <span>{layer.label}</span>
                <input
                  type="checkbox"
                  checked={visibleLayers[layer.id] || false}
                  onChange={() => toggleLayer(layer.id)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
