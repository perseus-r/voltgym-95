import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplets, Activity, Zap, Target } from 'lucide-react';
import { toast } from 'sonner';

interface NutritionCardProps {
  title: string;
  value: string;
  target?: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  actions?: React.ReactNode;
}

function NutritionCard({ title, value, target, progress, icon, color, actions }: NutritionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className={`w-10 h-10 bg-${color}/20 rounded-xl flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          
          <div className="text-3xl font-bold mb-2" style={{ color: `var(--${color})` }}>
            {value}
          </div>
          
          {target && (
            <div className="text-sm text-txt-2 mb-4">
              {target}
            </div>
          )}
          
          <Progress 
            value={progress} 
            className="h-3 bg-surface mb-3"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-txt-2">
              {progress >= 100 ? '✅ Meta atingida!' : `${Math.round(progress)}% completo`}
            </span>
            <span className="font-semibold text-sm" style={{ color: `var(--${color})` }}>
              {Math.round(progress)}%
            </span>
          </div>
          
          {actions && (
            <div className="mt-4">
              {actions}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

interface WaterIntakeProps {
  consumed: number;
  target: number;
  onAddWater: (amount: number) => void;
}

export function WaterIntakeCard({ consumed, target, onAddWater }: WaterIntakeProps) {
  return (
    <NutritionCard
      title="💧 Hidratação"
      value={`${(consumed / 1000).toFixed(1)}L`}
      target={`de ${target / 1000}L`}
      progress={(consumed / target) * 100}
      icon={<Droplets className="w-5 h-5 text-blue-400" />}
      color="blue-400"
      actions={
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              onAddWater(250);
              toast.success('+250ml adicionados!');
            }}
            className="text-xs border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
          >
            +250ml
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              onAddWater(500);
              toast.success('+500ml adicionados!');
            }}
            className="text-xs border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
          >
            +500ml
          </Button>
        </div>
      }
    />
  );
}

interface MacroCardProps {
  title: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
  emoji: string;
}

export function MacroCard({ title, consumed, target, unit, color, emoji }: MacroCardProps) {
  return (
    <NutritionCard
      title={`${emoji} ${title}`}
      value={`${consumed}${unit}`}
      target={`de ${target}${unit}`}
      progress={(consumed / target) * 100}
      icon={<Activity className="w-5 h-5" style={{ color: `var(--${color})` }} />}
      color={color}
    />
  );
}

interface CalorieCardProps {
  consumed: number;
  target: number;
  onQuickAdd: (calories: number) => void;
}

export function CalorieCard({ consumed, target, onQuickAdd }: CalorieCardProps) {
  return (
    <NutritionCard
      title="🔥 Calorias"
      value={consumed.toLocaleString()}
      target={`de ${target.toLocaleString()} kcal`}
      progress={(consumed / target) * 100}
      icon={<Zap className="w-5 h-5 text-accent" />}
      color="accent"
      actions={
        <div className="grid grid-cols-3 gap-1">
          {[100, 200, 300].map(cal => (
            <Button
              key={cal}
              size="sm"
              variant="outline"
              onClick={() => {
                onQuickAdd(cal);
                toast.success(`+${cal} kcal adicionadas!`);
              }}
              className="text-xs border-accent/30 text-accent hover:bg-accent/10"
            >
              +{cal}
            </Button>
          ))}
        </div>
      }
    />
  );
}