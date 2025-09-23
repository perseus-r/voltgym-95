import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { seedExercises } from "@/data/seedData";
import { WorkoutService } from "@/services/WorkoutService";
import { format, subDays } from "date-fns";
import { BarChart3, Activity } from "lucide-react";

interface SeriesPoint {
  date: string;
  value: number;
}

interface ExerciseSeries {
  name: string;
  data: SeriesPoint[];
}

const LEG_GROUPS = ["quadriceps", "isquiotibiais", "gluteos", "panturrilhas"];

const GROUP_OPTIONS = [
  { value: "peito", label: "Peito" },
  { value: "pernas", label: "Pernas" },
  { value: "costas", label: "Costas" },
  { value: "ombros", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "core", label: "Core" },
];

function getGroupExercises(group: string) {
  if (group === "pernas") {
    return seedExercises.filter((e) => LEG_GROUPS.includes(e.grupo));
  }
  return seedExercises.filter((e) => e.grupo === group);
}

function getColor(index: number) {
  const palette = [
    "hsl(var(--accent))",
    "#ffd700",
    "#ff6b6b",
    "#7fff7f",
    "#a78bfa",
    "#34d399",
  ];
  return palette[index % palette.length];
}

export default function MuscleGroupCharts() {
  const { user } = useAuth();
  const [group, setGroup] = useState<string>("peito");
  const [metric, setMetric] = useState<"weight" | "volume" | "reps" | "rpe">("weight");
  const [range, setRange] = useState<"week" | "month" | "year">("month");
  const [selected, setSelected] = useState<string[]>([]);
  const [series, setSeries] = useState<ExerciseSeries[]>([]);
  const [loading, setLoading] = useState(false);

  const exercises = useMemo(() => getGroupExercises(group), [group]);

  useEffect(() => {
    // Auto-select up to 2 first exercises when switching group
    setSelected((prev) => {
      const valid = prev.filter((id) => exercises.some((e) => e.id === id));
      if (valid.length > 0) return valid.slice(0, 3);
      return exercises.slice(0, 2).map((e) => e.id);
    });
  }, [group]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, metric, range, user]);

  const loadData = async () => {
    if (!user || selected.length === 0) {
      setSeries([]);
      return;
    }

    setLoading(true);
    try {
      const history = await WorkoutService.getUserWorkoutHistory(500);

      const cutoff = range === "week" ? subDays(new Date(), 7) : range === "month" ? subDays(new Date(), 30) : subDays(new Date(), 365);

      const selectedExercises = exercises.filter((e) => selected.includes(e.id));

      const seriesData: ExerciseSeries[] = selectedExercises.map((ex) => {
        const points: SeriesPoint[] = [];

        history.forEach((session: any) => {
          const date = new Date(session.started_at || session.created_at || session.completed_at);
          if (!date || isNaN(date.getTime()) || date < cutoff) return;

          session.exercise_logs?.forEach((log: any) => {
            const logName = log.exercises?.name || log.exercise_id || "";
            if (logName === ex.nome) {
              let valueForSession = 0;
              let repsTotal = 0;
              let rpeSum = 0;
              let rpeCount = 0;

              log.set_logs?.forEach((s: any) => {
                const w = Number(s.weight || 0);
                const r = Number(s.reps || 0);
                const rpe = Number(s.rpe || 0);
                if (metric === "weight") valueForSession = Math.max(valueForSession, w);
                if (metric === "volume") valueForSession += w * r;
                if (metric === "reps") repsTotal += r;
                if (metric === "rpe" && rpe > 0) { rpeSum += rpe; rpeCount += 1; }
              });

              if (metric === "reps") valueForSession = repsTotal;
              if (metric === "rpe") valueForSession = rpeCount > 0 ? rpeSum / rpeCount : 0;

              points.push({ date: format(date, "yyyy-MM-dd"), value: Number(valueForSession.toFixed(2)) });
            }
          });
        });

        // Aggregate by day keeping max
        const map = new Map<string, number>();
        points.forEach((p) => {
          const prev = map.get(p.date) || 0;
          map.set(p.date, Math.max(prev, p.value));
        });

        const aggregated = Array.from(map.entries())
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { name: ex.nome, data: aggregated } as ExerciseSeries;
      });

      setSeries(seriesData);
    } catch (e) {
      console.error(e);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const combinedDates = useMemo(() => {
    const all = new Set<string>();
    series.forEach((s) => s.data.forEach((p) => all.add(p.date)));
    return Array.from(all.values()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [series]);

  const chartData = useMemo(() => {
    return combinedDates.map((d) => {
      const row: any = { date: d };
      series.forEach((s, i) => {
        const found = s.data.find((p) => p.date === d);
        row[s.name] = found ? found.value : null;
      });
      return row;
    });
  }, [combinedDates, series]);

  const toggleExercise = (id: string) => {
    setSelected((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // máx. 3
      return [...prev, id];
    });
  };

  const metricLabel = metric === "weight" ? "Carga (kg)" : metric === "volume" ? "Volume (kg)" : metric === "reps" ? "Reps" : "RPE";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-txt">Gráficos por Grupo</h3>
        </div>
        <div className="flex gap-2">
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="w-32 glass-card border-line/50">
              <SelectValue placeholder="Grupo" />
            </SelectTrigger>
            <SelectContent>
              {GROUP_OPTIONS.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={metric} onValueChange={(v: any) => setMetric(v)}>
            <SelectTrigger className="w-32 glass-card border-line/50">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Carga</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="reps">Reps</SelectItem>
              <SelectItem value="rpe">RPE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger className="w-28 glass-card border-line/50">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="glass-card p-4">
        <h4 className="text-sm font-medium text-txt-2 mb-3">Selecione até 3 exercícios</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {exercises.map((ex) => (
            <label key={ex.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${selected.includes(ex.id) ? 'border-accent bg-accent/10' : 'border-line/40 bg-surface/40'} cursor-pointer`}>
              <Checkbox checked={selected.includes(ex.id)} onCheckedChange={() => toggleExercise(ex.id)} />
              <span className="text-sm text-txt-2">{ex.nome}</span>
            </label>
          ))
          }
        </div>
      </Card>

      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-txt">{metricLabel}</h4>
          <Badge className="bg-accent/20 text-accent">{chartData.length} registros</Badge>
        </div>

        {loading || series.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-txt-3 text-center">
            <div>
              <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-60" />
              {loading ? "Carregando..." : "Selecione exercícios para comparar"}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#8892b0" tickFormatter={(value) => format(new Date(value), 'dd/MM')} />
              <YAxis stroke="#8892b0" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--line))', borderRadius: 8 }} />
              {series.map((s, i) => (
                <Line key={s.name} type="monotone" dataKey={s.name} stroke={getColor(i)} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {series.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {series.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-sm text-txt-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: getColor(i) }} />
                {s.name}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
