import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Save, Play } from "lucide-react";
import { Exercise } from "@/lib/api";

interface WorkoutTableProps {
  focus: string;
  exercises: Exercise[];
  onSave: (exercises: Exercise[]) => void;
  onStart: () => void;
}

export function WorkoutTable({ focus, exercises, onSave, onStart }: WorkoutTableProps) {
  const [workoutData, setWorkoutData] = useState<Exercise[]>(exercises);
  const [loading, setLoading] = useState(false);

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...workoutData];
    updated[index] = { ...updated[index], [field]: value };
    setWorkoutData(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(workoutData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Treino de Hoje</h3>
          <Badge className="bg-accent text-accent-foreground mt-2">
            {focus}
          </Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercício</TableHead>
              <TableHead className="text-center">Séries × Reps</TableHead>
              <TableHead className="text-center">Descanso</TableHead>
              <TableHead className="text-center">Carga</TableHead>
              <TableHead className="text-center">RPE</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workoutData.map((exercise, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {exercise.sets} × {exercise.reps}
                </TableCell>
                <TableCell className="text-center">
                  {exercise.rest_s}s
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={exercise.weight || ''}
                    onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                    placeholder="kg"
                    className="w-20 text-center"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={exercise.rpe || ''}
                    onChange={(e) => updateExercise(index, 'rpe', parseInt(e.target.value) || 0)}
                    placeholder="1-10"
                    className="w-20 text-center"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={exercise.notes || ''}
                    onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                    placeholder="Observações..."
                    className="min-w-[150px] min-h-[36px] resize-none"
                    rows={1}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button variant="hero" onClick={onStart} className="flex-1" size="lg">
          <Play className="w-4 h-4 mr-2" />
          Iniciar Treino
        </Button>
        <Button variant="outline" onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Cargas
        </Button>
      </div>
    </Card>
  );
}