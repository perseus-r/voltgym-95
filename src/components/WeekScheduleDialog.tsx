import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface WeekScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWorkoutIds: string[];
}

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Segunda' },
  { key: 'tue', label: 'Terça' },
  { key: 'wed', label: 'Quarta' },
  { key: 'thu', label: 'Quinta' },
  { key: 'fri', label: 'Sexta' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
];

export function WeekScheduleDialog({ open, onOpenChange, selectedWorkoutIds }: WeekScheduleDialogProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (key: string) => {
    setSelectedDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('weekly_workout_schedule') || '{}');
      selectedDays.forEach((day) => {
        existing[day] = [...selectedWorkoutIds];
      });
      localStorage.setItem('weekly_workout_schedule', JSON.stringify(existing));
      onOpenChange(false);
    } catch (e) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar treinos na semana</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-txt-2">Selecione os dias que receberão os {selectedWorkoutIds.length} treino(s) selecionado(s).</p>
          <div className="grid grid-cols-2 gap-2">
            {DAYS.map(({ key, label }) => (
              <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border ${selectedDays.includes(key) ? 'border-accent' : 'border-border'}`}>
                <Checkbox checked={selectedDays.includes(key)} onCheckedChange={() => toggleDay(key)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Agenda</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WeekScheduleDialog;
