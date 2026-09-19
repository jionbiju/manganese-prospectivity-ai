import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell as RechartsCell } from "recharts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  feature: any;
  shapValues: any[];
  activeModel: string;
}

export default function CellDrawer({ isOpen, onClose, feature, shapValues, activeModel }: Props) {
  if (!isOpen || !feature) return null;

  const props = feature.properties;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl z-20 flex flex-col border-l border-slate-200">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800">Grid Cell Details</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 p-3 rounded-md">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Probability</div>
            <div className="text-2xl font-bold text-brand-600">
              {(props[activeModel] * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-100 p-3 rounded-md">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Confidence</div>
            <div className="text-2xl font-bold text-slate-700">
              {(props.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Feature values */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Features</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Lithology</span>
              <span className="font-medium text-slate-800">{props.lithology}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Dist. to Fault</span>
              <span className="font-medium text-slate-800">{props.fault_dist_m} m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">NDVI</span>
              <span className="font-medium text-slate-800">{props.ndvi}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">LST</span>
              <span className="font-medium text-slate-800">{props.lst_c} °C</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Slope</span>
              <span className="font-medium text-slate-800">{props.slope_deg}°</span>
            </div>
          </div>
        </div>

        {/* SHAP Chart */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-slate-900 mb-1 uppercase tracking-wider">Why is this area prospective?</h3>
          <p className="text-xs text-slate-500 mb-4">Feature contributions (SHAP values)</p>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapValues} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="feature" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  width={70}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {shapValues.map((entry, index) => (
                    <RechartsCell key={`cell-${index}`} fill={entry.value >= 0 ? '#14b8a6' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
