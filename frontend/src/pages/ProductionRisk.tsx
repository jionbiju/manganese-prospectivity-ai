import { useState } from "react";
import { useProduction } from "../hooks/useProduction";
import ForecastChart from "../components/charts/ForecastChart";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "../lib/utils";

export default function ProductionRisk() {
  const { production, alerts, loading, error } = useProduction();
  const [selectedMine, setSelectedMine] = useState<string>("m1");

  if (loading) return <div className="p-8 text-slate-500">Loading production data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;
  if (!production || !alerts) return null;

  const mineData = production.mines.find(m => m.id === selectedMine) || production.mines[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Production Risk</h1>
          <p className="text-slate-500">12-month output forecast and expected shortfall analysis.</p>
        </div>
        <select
          value={selectedMine}
          onChange={(e) => setSelectedMine(e.target.value)}
          className="border-slate-300 rounded-md shadow-sm text-sm focus:border-brand-500 focus:ring-brand-500"
        >
          {production.mines.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-800">Predicted vs Planned Output</h2>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase">Risk Level</span>
                <span className={cn(
                  "text-sm font-bold px-2 py-0.5 rounded",
                  mineData.risk === "High" ? "bg-red-100 text-red-700" :
                  mineData.risk === "Medium" ? "bg-amber-100 text-amber-700" :
                  "bg-green-100 text-green-700"
                )}>
                  {mineData.risk} Risk
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase">Est. Shortfall</span>
                <span className="text-lg font-bold text-slate-900">{mineData.shortfall_t.toLocaleString()} t</span>
              </div>
            </div>
          </div>
          <ForecastChart data={mineData.months} />
        </div>

        {/* Drivers & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Top Contributing Factors</h2>
            <div className="space-y-4">
              {mineData.drivers.map((driver, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{driver.factor}</span>
                    <span className="font-medium text-slate-900">{(driver.impact * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${driver.impact * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              {alerts.filter(a => a.mine.includes(mineData.name) || a.mine === "All").length === 0 ? (
                <div className="text-sm text-slate-500 italic">No alerts for this mine.</div>
              ) : (
                alerts.filter(a => a.mine.includes(mineData.name) || a.mine === "All").map(alert => (
                  <div key={alert.id} className="flex gap-3 p-3 rounded-md bg-slate-50 border border-slate-100">
                    {alert.severity === "critical" || alert.severity === "high" ? (
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    ) : alert.severity === "medium" ? (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase text-slate-700">{alert.driver}</span>
                        <span className="text-xs text-slate-400">{alert.date}</span>
                      </div>
                      <p className="text-sm text-slate-600">{alert.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
