import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  SkipForward, 
  Check, 
  Timer, 
  Zap, 
  Plus, 
  Minus,
  X,
  Target,
  Dumbbell,
  Clock,
  Settings
} from "lucide-react";
import { Exercise } from "@/types";
import { RestTimer } from "./RestTimer";
import { ExerciseHints } from "./ExerciseHints";
import { AdvancedSetControls } from "./AdvancedSetControls";
import { DropSetManager } from "./DropSetManager";
import { LoadProgressionControls } from "./LoadProgressionControls";
import { useVibration } from "@/hooks/useVibration";
import { useWorkoutVariations } from "@/hooks/useWorkoutVariations";
import { FocusMode } from "./FocusMode";

interface ActiveWorkoutSessionProps {
  workout: {
    id: string;
    focus: string;
    exercises: Exercise[];
  };
  onComplete: () => void;
  onClose: () => void;
}

export function ActiveWorkoutSession({ workout, onComplete, onClose }: ActiveWorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [rpe, setRpe] = useState(5);
  const [notes, setNotes] = useState("");
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showDropSet, setShowDropSet] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [startTime] = useState(new Date());

  const { vibrateSuccess, vibrateClick } = useVibration();
  const {
    sets,
    currentVariations,
    loadProgression,
    addSet,
    updateSet,
    addDropSet,
    calculateProgressiveLoad,
    suggestNextWeight,
    enableVariation,
    setLoadProgression,
    getWorkoutSummary
  } = useWorkoutVariations();

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  const totalSets = currentExercise?.sets || 3;
  const lastCompletedSet = sets.filter(s => s.completed).slice(-1)[0];
  const suggestedWeightValue = suggestNextWeight(lastCompletedSet, 8);

  useEffect(() => {
    // Reset states when exercise changes
    setCurrentSet(1);
    setWeight(currentVariations.autoProgression ? 
      calculateProgressiveLoad(1, weight) : 
      suggestedWeightValue || 0
    );
    setReps(0);
    setRpe(5);
    setNotes("");
    setCompletedSets([]);
    setShowDropSet(false);
  }, [currentExerciseIndex]);

  // Auto-update weight based on progression
  useEffect(() => {
    if (currentVariations.autoProgression && weight > 0) {
      const newWeight = calculateProgressiveLoad(currentSet, weight);
      if (newWeight !== weight) {
        setWeight(newWeight);
      }
    }
  }, [currentSet, currentVariations.autoProgression, calculateProgressiveLoad]);

  const handleWeightChange = (increment: number) => {
    vibrateClick();
    setWeight(prev => Math.max(0, prev + increment));
  };

  const handleCompleteSet = () => {
    vibrateSuccess();
    
    // Add set to workout variations system
    const setData = {
      setNumber: currentSet,
      weight,
      reps,
      rpe,
      notes,
      completed: true,
      variation: { type: 'normal' as const }
    };
    
    addSet(setData);
    
    // Save set data for session tracking
    const exerciseName = currentExercise.name || currentExercise.nome || "";
    setSessionData(prev => ({
      ...prev,
      [exerciseName]: [
        ...(prev[exerciseName] || []),
        setData
      ]
    }));

    setCompletedSets(prev => [...prev, currentSet]);

    if (currentSet < totalSets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
    } else {
      handleCompleteExercise();
    }
  };

  const handleCompleteExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsResting(false);
    } else {
      handleCompleteWorkout();
    }
  };

  const handleCompleteWorkout = () => {
    const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000);
    const summary = getWorkoutSummary();
    vibrateSuccess();
    
    // Could save summary to local storage or API here
    console.log('Workout Summary:', summary);
    
    onComplete();
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsResting(false);
    } else {
      handleCompleteWorkout();
    }
  };

  const handleDropSetComplete = (drops: { weight: number; reps: number }[]) => {
    // Add main set first
    const mainSet = {
      setNumber: currentSet,
      weight,
      reps,
      rpe,
      notes,
      completed: true,
      variation: { 
        type: 'drop' as const, 
        data: { drops }
      }
    };
    
    addSet(mainSet);
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < totalSets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
    } else {
      handleCompleteExercise();
    }
    
    setShowDropSet(false);
  };

  const handleApplySuggestedWeight = () => {
    setWeight(suggestedWeightValue);
    vibrateClick();
  };

  return (
    <div className="fixed inset-0 bg-bg z-50 overflow-y-auto safe-area">
      {/* Header - Mobile Optimized */}
      <div className="sticky top-0 bg-bg/95 backdrop-blur border-b border-line p-3 md:p-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-txt-2 hover:text-txt flex-shrink-0 w-8 h-8 md:w-10 md:h-10"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-xl font-semibold text-txt truncate">{workout.focus}</h1>
              <p className="text-xs md:text-sm text-txt-2">
                Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFocusMode(!showFocusMode)}
              className="glass-button text-xs md:text-sm px-2 md:px-3 h-8 md:h-9"
            >
              <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Foco</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              className="glass-button text-xs md:text-sm px-2 md:px-3 h-8 md:h-9"
            >
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Avançado</span>
            </Button>
          </div>
        </div>
        
        <Progress value={progress} className="mt-2 md:mt-3 h-1 md:h-2" />
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="p-3 md:p-4 max-w-2xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Current Exercise */}
        <Card className="glass-card p-4 md:p-6">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-txt mb-2 line-clamp-2">{currentExercise.name || currentExercise.nome}</h2>
            <div className="flex items-center justify-center gap-2 md:gap-4 text-txt-2 text-xs md:text-sm">
              <div className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>Série {currentSet}/{totalSets}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>{currentExercise.reps || "8-10"} reps</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>{currentExercise.rest_s || 90}s</span>
              </div>
            </div>
          </div>

          {/* Weight Input - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="text-sm font-medium text-txt-2 mb-2 block">Peso (kg)</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWeightChange(-2.5)}
                  className="glass-button w-10 h-10 md:w-12 md:h-12 flex-shrink-0"
                >
                  <Minus className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
                
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="text-center text-base md:text-lg font-semibold h-10 md:h-12"
                  placeholder="0"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleWeightChange(2.5)}
                  className="glass-button w-10 h-10 md:w-12 md:h-12 flex-shrink-0"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
              
              {/* Quick weight buttons - Mobile Grid */}
              <div className="grid grid-cols-4 gap-1 md:gap-2 mt-2">
                {[2.5, 5, 10, 20].map((increment) => (
                  <Button
                    key={increment}
                    variant="outline"
                    size="sm"
                    onClick={() => handleWeightChange(increment)}
                    className="glass-button text-xs h-8 touch-manipulation"
                  >
                    +{increment}
                  </Button>
                ))}
              </div>
            </div>

            {/* Reps Input */}
            <div>
              <label className="text-sm font-medium text-txt-2 mb-2 block">Repetições</label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="text-center text-base md:text-lg h-10 md:h-12"
                placeholder="0"
              />
            </div>

            {/* RPE - Mobile Grid */}
            <div>
              <label className="text-sm font-medium text-txt-2 mb-2 block">RPE (1-10)</label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-1 md:gap-1">
                {[...Array(10)].map((_, i) => (
                  <Button
                    key={i}
                    variant={rpe === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRpe(i + 1)}
                    className={`h-8 md:h-9 text-xs touch-manipulation ${rpe === i + 1 ? "bg-accent text-accent-ink" : "glass-button"}`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-txt-2 mb-2 block">Notas (opcional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Como foi esta série?"
                className="resize-none h-16 md:h-20 text-sm"
              />
            </div>
          </div>

          <Separator className="my-4 md:my-6" />

          {/* Action Buttons - Mobile Stack */}
          <div className="space-y-2 md:space-y-3">
            <Button
              onClick={handleCompleteSet}
              disabled={!weight || !reps}
              className="w-full bg-accent hover:bg-accent/90 text-accent-ink font-semibold py-3 md:py-4 h-12 md:h-14 text-sm md:text-base"
            >
              <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Completar Série {currentSet}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleSkipExercise}
                className="glass-button h-10 md:h-12 text-xs md:text-sm"
              >
                <SkipForward className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Pular
              </Button>
              
              {currentExerciseIndex === workout.exercises.length - 1 && (
                <Button
                  onClick={handleCompleteWorkout}
                  variant="outline"
                  className="glass-button border-accent text-accent h-10 md:h-12 text-xs md:text-sm"
                >
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Finalizar
                </Button>
              )}
            </div>
          </div>

          {/* Completed Sets */}
          {completedSets.length > 0 && (
            <div className="mt-3 md:mt-4">
              <p className="text-sm text-txt-2 mb-2">Séries completadas:</p>
              <div className="flex gap-1 md:gap-2 flex-wrap">
                {completedSets.map((setNum) => (
                  <Badge key={setNum} variant="secondary" className="bg-accent/20 text-accent text-xs">
                    S{setNum}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Load Progression Controls */}
        {showAdvancedControls && (
          <LoadProgressionControls
            progression={loadProgression}
            onUpdate={setLoadProgression}
            autoEnabled={currentVariations.autoProgression}
            onAutoToggle={(enabled) => enableVariation('autoProgression', enabled)}
            currentSet={currentSet}
            lastRpe={lastCompletedSet?.rpe}
            suggestedWeight={suggestedWeightValue}
            onApplySuggestion={handleApplySuggestedWeight}
          />
        )}

        {/* Advanced Set Controls */}
        {showAdvancedControls && (
          <AdvancedSetControls
            variations={currentVariations}
            onVariationToggle={enableVariation}
            onDropSetStart={() => setShowDropSet(true)}
            onRestPauseStart={() => {/* TODO: Implement */}}
            onClusterStart={() => {/* TODO: Implement */}}
            currentWeight={weight}
            currentReps={reps}
          />
        )}

        {/* Exercise Hints */}
        <ExerciseHints exerciseName={currentExercise.name || currentExercise.nome || ""} />

        {/* Rest Timer */}
        {isResting && (
          <RestTimer
            exerciseName={currentExercise.name || currentExercise.nome || ""}
            defaultDuration={currentExercise.rest_s || 90}
            onComplete={() => setIsResting(false)}
            className="mt-6"
          />
        )}
      </div>

      {/* Drop Set Modal */}
      {showDropSet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <DropSetManager
              currentWeight={weight}
              onDropComplete={handleDropSetComplete}
              onClose={() => setShowDropSet(false)}
            />
          </div>
        </div>
      )}

      {/* Focus Mode */}
      <FocusMode
        isActive={showFocusMode}
        onToggle={() => setShowFocusMode(!showFocusMode)}
        currentExercise={currentExercise.name || currentExercise.nome || ""}
        currentSet={currentSet}
        totalSets={totalSets}
        restTime={isResting ? (currentExercise.rest_s || 90) : undefined}
      />
    </div>
  );
}