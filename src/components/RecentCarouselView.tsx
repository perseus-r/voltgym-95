import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import { getWorkoutHistory } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

export function RecentCarouselView() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const history = user ? getWorkoutHistory(user.id).slice(-5) : []; // Last 5 workouts

  if (history.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Nenhum treino registrado</h3>
        <p className="text-txt-2 text-sm">Complete seu primeiro treino para ver o histórico aqui!</p>
      </div>
    );
  }

  const currentWorkout = history[currentIndex];
  const workoutDate = new Date(currentWorkout.ts);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % history.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + history.length) % history.length);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Treinos Recentes</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="p-1 rounded-full bg-surface hover:bg-card transition-colors"
            disabled={history.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-txt-3">
            {currentIndex + 1} de {history.length}
          </span>
          <button 
            onClick={nextSlide}
            className="p-1 rounded-full bg-surface hover:bg-card transition-colors"
            disabled={history.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-accent">{currentWorkout.focus}</h4>
            <div className="flex items-center gap-2 text-sm text-txt-2">
              <Clock className="w-4 h-4" />
              <span>{workoutDate.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-txt-3">Exercícios</div>
            <div className="text-lg font-bold text-accent">{currentWorkout.items.length}</div>
          </div>
        </div>

        <div className="space-y-2">
          {currentWorkout.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-surface p-3 rounded-lg">
              <span className="text-sm font-medium">{item.name}</span>
              <div className="flex items-center gap-3 text-sm text-txt-2">
                <span>{item.carga}kg</span>
                <span>RPE {item.rpe}</span>
              </div>
            </div>
          ))}
          {currentWorkout.items.length > 3 && (
            <div className="text-center text-sm text-txt-3">
              +{currentWorkout.items.length - 3} exercícios adicionais
            </div>
          )}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-1 mt-4">
          {history.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-accent' : 'bg-surface'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}