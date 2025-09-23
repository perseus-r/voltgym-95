import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface MiniChartProps {
  series: Array<{ name: string; data: number[] }>;
}

export default function MiniChart({ series }: MiniChartProps) {
  if (!series.length) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">Evolução</h3>
        </div>
        <div className="text-center py-8 text-txt-3">
          <p>Dados insuficientes para gráfico</p>
          <p className="text-sm mt-1">Complete mais treinos para ver sua evolução</p>
        </div>
      </div>
    );
  }

  const exerciseName = series[0].name;
  const data = series[0].data.map((value, index) => ({
    session: index + 1,
    weight: value
  }));

  const trend = data.length > 1 
    ? ((data[data.length - 1].weight - data[0].weight) / data[0].weight) * 100
    : 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">Evolução - {exerciseName}</h3>
        </div>
        <div className={`text-sm font-semibold ${trend >= 0 ? 'text-accent' : 'text-error'}`}>
          {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
        </div>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="session" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--txt-3))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--txt-3))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--line))',
                borderRadius: '8px',
                color: 'hsl(var(--txt))'
              }}
              formatter={(value) => [`${value}kg`, 'Carga']}
              labelFormatter={(label) => `Sessão ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--accent))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-txt-2">
          Últimas {data.length} sessões • {data[data.length - 1]?.weight || 0}kg atual
        </p>
      </div>
    </div>
  );
}