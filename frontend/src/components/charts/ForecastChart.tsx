import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Props {
  data: any[];
}

export default function ForecastChart({ data }: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `${val/1000}k`} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Area 
            type="monotone" 
            dataKey="upper" 
            stroke="none" 
            fill="#bae6fd" 
            fillOpacity={0.4} 
            name="80% Prediction Interval"
          />
          <Area 
            type="monotone" 
            dataKey="lower" 
            stroke="none" 
            fill="#ffffff" 
            fillOpacity={1} 
            tooltipType="none"
          />
          
          <Line 
            type="monotone" 
            dataKey="planned" 
            stroke="#94a3b8" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
            name="Planned Output (t)" 
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#0284c7" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Predicted Output (t)" 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
