import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Props {
  baseline: number;
  scenario: number;
}

export default function ScenarioBars({ baseline, scenario }: Props) {
  const data = [
    { name: "Output Projection", Baseline: baseline, Scenario: scenario }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value.toLocaleString()} t`, undefined]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={80} />
          <Bar dataKey="Scenario" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={80} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
