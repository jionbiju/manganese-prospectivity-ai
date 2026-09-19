import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { AlertTriangle, AlertCircle, Info, ChevronRight, TrendingUp, TrendingDown, Target } from "lucide-react";
import ForecastChart from "../components/charts/ForecastChart";
import MapView from "../components/map/MapView";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const { kpis, alerts, drillTargets, production, prospectivity, loading, error } = useDashboard();

  if (loading) return <div className="p-8 text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-500">Overview of Mn-Sight exploration and production KPIs.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis?.map((kpi) => {
          const isPositive = kpi.trend !== undefined && kpi.trend >= 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          return (
            <div key={kpi.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <div className="text-sm font-medium text-slate-500 mb-2">{kpi.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-slate-900">
                  {kpi.value} <span className="text-sm text-slate-500">{kpi.unit}</span>
                </div>
                {kpi.trend !== undefined && (
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    isPositive ? "text-green-600" : "text-red-500"
                  )}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    {Math.abs(kpi.trend)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Map Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-slate-800">High-Probability Zones & Reserves</h2>
            <Link to="/map" className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
              View Map <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="h-64 w-full relative pointer-events-none">
            <MapView
              prospectivity={prospectivity}
              occurrences={occurrences}
              faults={null}
              leases={leases}
              drillTargets={null}
              basemap="osm"
              activeModel="p_xgb"
              opacity={0.8}
              threshold={0.7}
              visibleLayers={{ prospectivity: true, occurrences: true, leases: true }}
              continuousColors={true}
              colorblindSafe={true}
              onCellClick={() => {}}
            />
          </div>
        </div>

        {/* Production Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-slate-800">Production Output Forecast (All Mines)</h2>
            <Link to="/risk" className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
              Analyze Risk <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="h-64 w-full p-4">
            {production && (
              <ForecastChart data={production.mines[0].months} /> // Showing first mine as aggregate proxy for demo
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Drill Targets */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-brand-600" />
              Top Ranked Drill Targets
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {drillTargets?.slice(0, 5).map((target) => (
              <div key={target.rank} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    {target.rank}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Drill Target #{target.rank}</div>
                    <div className="text-xs text-slate-500">[{target.lng.toFixed(3)}, {target.lat.toFixed(3)}]</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-600">{(target.score * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-500">Confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-800">Operational Alerts</h2>
          </div>
          <div className="p-4 space-y-4">
            {alerts?.slice(0, 5).map(alert => (
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
                    <span className="text-xs font-semibold uppercase text-slate-700">{alert.mine}</span>
                    <span className="text-xs text-slate-400">{alert.date}</span>
                  </div>
                  <p className="text-sm text-slate-600">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
