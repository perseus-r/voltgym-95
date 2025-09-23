import { useState } from "react";
import { Plus, Play, Timer, Target, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RestTimer } from "@/components/RestTimer";
import { GoalTracker } from "@/components/GoalTracker";

interface FloatingMenuProps {
  onStartWorkout: () => void;
  onOpenExercises?: () => void;
}

export function FloatingQuickMenu({ onStartWorkout, onOpenExercises }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  const menuItems = [
    {
      icon: <Play className="w-5 h-5" />,
      label: "Iniciar Treino",
      color: "from-blue-500 to-cyan-400",
      onClick: onStartWorkout
    },
    {
      icon: <Timer className="w-5 h-5" />,
      label: "Timer",
      color: "from-orange-500 to-red-500",
      onClick: () => {
        setShowTimer(true);
        setIsOpen(false);
      }
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: "Metas",
      color: "from-purple-500 to-pink-500",
      onClick: () => {
        setShowGoals(true);
        setIsOpen(false);
      }
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Exercícios",
      color: "from-green-500 to-emerald-500",
      onClick: () => {
        onOpenExercises?.();
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-sm font-medium text-txt-2 bg-bg/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-line/20">
                {item.label}
              </span>
              <Button
                size="icon"
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} text-white shadow-lg hover:scale-110 transition-all duration-300`}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main Button */}
      <Button
        size="icon"
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-error rotate-45 scale-110' 
            : 'bg-gradient-primary hover:scale-110 animate-pulse-glow'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-accent-ink" />
        )}
      </Button>

      {/* Timer Dialog */}
      <Dialog open={showTimer} onOpenChange={setShowTimer}>
        <DialogContent className="liquid-glass border border-line/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-txt flex items-center gap-2">
              <Timer className="w-5 h-5 text-accent" />
              Timer de Descanso
            </DialogTitle>
          </DialogHeader>
          <RestTimer 
            exerciseName="Descanso"
            defaultDuration={90}
            onComplete={() => {
              // Timer completed
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Goals Dialog */}
      <Dialog open={showGoals} onOpenChange={setShowGoals}>
        <DialogContent className="liquid-glass border border-line/20 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-txt flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Metas Personalizadas
            </DialogTitle>
          </DialogHeader>
          <GoalTracker />
        </DialogContent>
      </Dialog>
    </div>
  );
}