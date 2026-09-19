import { Database, BrainCircuit, LineChart, FileText } from "lucide-react";

export default function MethodData() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Methodology & Data</h1>
        <p className="text-slate-500">Overview of the machine learning pipeline and data sources used in the Mn-Sight platform.</p>
      </div>

      {/* ML Pipeline Diagram */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">AI/ML Pipeline Architecture</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100 w-full md:w-1/4">
            <Database className="w-8 h-8 text-brand-600 mb-2" />
            <h3 className="font-medium text-slate-900 text-center">Data Ingestion</h3>
            <p className="text-xs text-slate-500 text-center mt-2">GSI datasets, satellite imagery (Sentinel/Landsat), geological maps.</p>
          </div>

          <div className="hidden md:block text-slate-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>

          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100 w-full md:w-1/4">
            <FileText className="w-8 h-8 text-brand-600 mb-2" />
            <h3 className="font-medium text-slate-900 text-center">Preprocessing</h3>
            <p className="text-xs text-slate-500 text-center mt-2">Spatial alignment (QGIS/GDAL), rasterization, null handling.</p>
          </div>

          <div className="hidden md:block text-slate-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>

          <div className="flex flex-col items-center p-4 bg-brand-50 rounded-lg border border-brand-200 w-full md:w-1/4 shadow-sm relative">
            <div className="absolute -top-3 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">CORE</div>
            <BrainCircuit className="w-8 h-8 text-brand-600 mb-2" />
            <h3 className="font-medium text-brand-900 text-center">Ensemble Model</h3>
            <p className="text-xs text-brand-700 text-center mt-2">XGBoost & Random Forest spatial classification.</p>
          </div>

          <div className="hidden md:block text-slate-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>

          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100 w-full md:w-1/4">
            <LineChart className="w-8 h-8 text-brand-600 mb-2" />
            <h3 className="font-medium text-slate-900 text-center">Prediction & SHAP</h3>
            <p className="text-xs text-slate-500 text-center mt-2">Prospectivity mapping and feature importance.</p>
          </div>

        </div>
      </section>

      {/* Data Sources Table */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Primary Data Sources</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Dataset</th>
                <th className="py-3 px-6">Provider / Source</th>
                <th className="py-3 px-6">Resolution / Scale</th>
                <th className="py-3 px-6">Usage in Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-6 font-medium">Lithology & Structure</td>
                <td className="py-3 px-6">GSI (Geological Survey of India)</td>
                <td className="py-3 px-6">1:50,000</td>
                <td className="py-3 px-6">Categorical base layers, fault distance mapping</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-6 font-medium">Multispectral Imagery</td>
                <td className="py-3 px-6">Sentinel-2 / Landsat 8 (USGS/ESA)</td>
                <td className="py-3 px-6">10m - 30m</td>
                <td className="py-3 px-6">NDVI, surface reflectance anomalies</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-6 font-medium">Digital Elevation Model (DEM)</td>
                <td className="py-3 px-6">SRTM / Bhuvan</td>
                <td className="py-3 px-6">30m</td>
                <td className="py-3 px-6">Slope, aspect, elevation</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-6 font-medium">Magnetic & Gravity Anomalies</td>
                <td className="py-3 px-6">GSI Bouguer Gravity</td>
                <td className="py-3 px-6">Regional grid</td>
                <td className="py-3 px-6">Subsurface structural proxy</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-6 font-medium">Known Mn Occurrences</td>
                <td className="py-3 px-6">MOIL / GSI Mineral Inventory</td>
                <td className="py-3 px-6">Point Data</td>
                <td className="py-3 px-6">Training labels (Positive samples)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-2">Prototype Limitations</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          The data presented in this dashboard (including prospectivity heatmaps, drill targets, and production forecasts) 
          is <strong>mocked/synthetic</strong> for the purpose of the Smart India Hackathon prototype demonstration. 
          The backend API endpoints are configured to serve static GeoJSON and JSON payloads. 
          To deploy this for real-world usage, the <code>VITE_USE_MOCK</code> environment variable must be disabled, 
          and the frontend must be connected to a live FastAPI inference server providing real SHAP values and geospatial computations.
        </p>
      </section>

    </div>
  );
}
