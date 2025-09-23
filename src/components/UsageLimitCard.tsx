import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UsageLimitCard = () => {
  const { isFree, usage_limits, hasReachedWorkoutLimit, hasReachedAILimit } = useSubscription();

  if (!isFree || !usage_limits) return null;

  const workoutProgress = (usage_limits.workouts_created / usage_limits.max_workouts) * 100;
  const aiProgress = (usage_limits.ai_requests / usage_limits.max_ai_requests) * 100;

  const hasLimits = hasReachedWorkoutLimit || hasReachedAILimit;

  return (
    <Card className="glass-card p-6 border-orange-500/30">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Plano Grátis - 3 dias</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-2">Treinos criados</span>
            <span className={hasReachedWorkoutLimit ? 'text-orange-400' : 'text-text-2'}>
              {usage_limits.workouts_created}/{usage_limits.max_workouts}
            </span>
          </div>
          <Progress value={workoutProgress} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-2">Consultas IA</span>
            <span className={hasReachedAILimit ? 'text-orange-400' : 'text-text-2'}>
              {usage_limits.ai_requests}/{usage_limits.max_ai_requests}
            </span>
          </div>
          <Progress value={aiProgress} className="h-2" />
        </div>
      </div>

      {hasLimits && (
        <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <p className="text-orange-200 text-sm mb-3">
            Você atingiu os limites do plano grátis. Faça upgrade para continuar!
          </p>
        </div>
      )}
      
      <Link to="/pro" className="block mt-4">
        <Button className="w-full volt-button">
          <Crown className="w-4 h-4 mr-2" />
          Fazer upgrade para Pro
        </Button>
      </Link>
    </Card>
  );
};

export default UsageLimitCard;