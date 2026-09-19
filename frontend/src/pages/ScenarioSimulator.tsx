import { useState } from "react";
import { useScenario } from "../hooks/useScenario";
import ScenarioBars from "../components/charts/ScenarioBars";
import { Settings2, ArrowUpRight, ArrowDownRight, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";

export default function ScenarioSimulator() {
  const { model, loading, error } = useScenario();
  
  const [equipment, setEquipment] = useState(0); // change in %
  const [blastingDelay, setBlastingDelay] = useState(0); // days
  const [rainfall, setRainfall] = useState(0); // change in %
  const [manpower, setManpower] = useState(0); // change in %

  if (loading) return <div className="p-8 text-slate-500">Loading simulator model...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;
  if (!model) return null;

  // Calculate new output based on linear model coefficients
  const baseline = model.baseline_tonnes;
  const c = model.coefficients;
  const delta = (equipment * c.equipment_availability) + 
                (blastingDelay * c.blasting_delay_days) + 
                (rainfall * c.rainfall_anomaly) + 
                (manpower * c.manpower);
  
  const predicted = Math.max(0, baseline + delta);
  const isPositive = delta > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scenario Simulator</h1>
        <p className="text-slate-500">Adjust operational factors to instantly model production impacts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100">
            <Settings2 className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Parameters</h2>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">Equipment Availability</span>
                <span className="font-medium">{equipment > 0 ? '+' : ''}{equipment}%</span>
              </div>
              <input type="range" min="-20" max="20" step="1" value={equipment} onChange={(e) => setEquipment(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">Blasting Delay</span>
                <span className="font-medium">{blastingDelay > 0 ? '+' : ''}{blastingDelay} days</span>
              </div>
              <input type="range" min="0" max="10" step="1" value={blastingDelay} onChange={(e) => setBlastingDelay(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">Rainfall Anomaly</span>
                <span className="font-medium">{rainfall > 0 ? '+' : ''}{rainfall}%</span>
              </div>
              <input type="range" min="-50" max="50" step="5" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">Manpower</span>
                <span className="font-medium">{manpower > 0 ? '+' : ''}{manpower}%</span>
              </div>
              <input type="range" min="-15" max="15" step="1" value={manpower} onChange={(e) => setManpower(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>
          </div>
          
          <button 
            onClick={() => { setEquipment(0); setBlastingDelay(0); setRainfall(0); setManpower(0); }}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
          >
            Reset to Baseline
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-1/2">
              <ScenarioBars baseline={baseline} scenario={predicted} />
            </div>
            <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
              <div>
                <div className="text-sm text-slate-500 uppercase tracking-wider mb-1">Modeled Impact</div>
                <div className={cn("text-4xl font-bold flex items-center gap-2", delta === 0 ? "text-slate-400" : isPositive ? "text-green-500" : "text-red-500")}>
                  {delta !== 0 && (isPositive ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />)}
                  {Math.abs(delta).toLocaleString()} t
                </div>
              </div>
              <p className="text-slate-600 text-sm">
                {delta === 0 
                  ? "Adjust parameters on the left to simulate operational changes." 
                  : `This scenario results in a ${isPositive ? 'gain' : 'loss'} of ${Math.abs(delta).toLocaleString()} tonnes compared to baseline.`
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Recommended Action</h3>
                  <p className="text-sm text-amber-700 mb-3">Redeploy idle loaders from Pit B to offset the expected 3-day blasting delay.</p>
                  <div className="inline-flex items-center text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Recovers ~3,600 t
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Maintenance Window</h3>
                  <p className="text-sm text-blue-700 mb-3">Schedule excavator maintenance during the heavy rainfall anomaly to minimize opportunity cost.</p>
                  <div className="inline-flex items-center text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Saves ~1,200 t
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-center text-slate-400 mt-4">
            * Modelled scenario outputs are approximations for decision support, not operational guarantees.
          </div>
        </div>

      </div>
    </div>
  );
}
