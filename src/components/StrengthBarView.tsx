import React, { useEffect, useState } from 'react';
import { ProgressEngine } from '@/services/ProgressEngine';

interface StrengthBarViewProps {
  className?: string;
}

export function StrengthBarView({ className = '' }: StrengthBarViewProps) {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    updateProgress();

    // Listen for level up events
    const handleLevelUp = () => {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      updateProgress();
    };

    window.addEventListener('levelUp', handleLevelUp);
    return () => window.removeEventListener('levelUp', handleLevelUp);
  }, []);

  const updateProgress = () => {
    setXP(ProgressEngine.currentXP());
    setLevel(ProgressEngine.currentLevel());
  };

  return (
    <div className={`relative ${className}`}>
      {/* Level Up Celebration */}
      {showLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center animate-bounce">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-lg font-bold text-white">LEVEL UP!</div>
            <div className="text-sm text-accent">Nível {level}</div>
          </div>
        </div>
      )}

      {/* Strength Bar Container */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--txt-2)' }}>
            Força/XP
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            Nível {level}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div 
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                width: `${xp}%`,
                background: 'linear-gradient(90deg, #7BDcff 0%, #2ECC71 100%)',
                boxShadow: '0 0 10px rgba(123, 220, 255, 0.5)'
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shimmer 2s infinite'
                }}
              />
            </div>
          </div>

          {/* XP Text */}
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: 'var(--txt-2)' }}>
              {xp}/100 XP
            </span>
            <span className="text-xs" style={{ color: 'var(--txt-2)' }}>
              {100 - xp} para próximo nível
            </span>
          </div>
        </div>

        {/* Motivational Text */}
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--txt-2)' }}>
            {xp < 25 && "Começando a jornada! 💪"}
            {xp >= 25 && xp < 50 && "Ganhando força! 🔥"}
            {xp >= 50 && xp < 75 && "Ficando forte! ⚡"}
            {xp >= 75 && xp < 95 && "Quase lá! 🚀"}
            {xp >= 95 && "Level up chegando! 🎯"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}