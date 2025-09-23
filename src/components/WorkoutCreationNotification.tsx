import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Dumbbell, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkoutCreationNotificationProps {
  workoutName: string;
  onDismiss: () => void;
}

export const WorkoutCreationNotification: React.FC<WorkoutCreationNotificationProps> = ({
  workoutName,
  onDismiss
}) => {
  const navigate = useNavigate();

  const handleViewWorkout = () => {
    onDismiss();
    navigate('/treinos');
  };

  return (
    <Card className="glass-card p-4 border-green-400/30 bg-green-500/10">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-green-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1">
            🏋️ Treino Criado com Sucesso!
          </h4>
          <p className="text-xs text-text-2 mb-3">
            <strong className="text-green-400">{workoutName}</strong> foi adicionado aos seus treinos personalizados.
          </p>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleViewWorkout}
              className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
            >
              <Dumbbell className="w-3 h-3 mr-1.5" />
              Ver Treino
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="h-7 px-3 text-xs text-text-2 hover:text-white"
            >
              Dispensar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};