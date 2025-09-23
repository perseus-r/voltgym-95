import React, { useState } from 'react';
import { X, Smile, Battery, Target } from 'lucide-react';
import { VibeLog } from '@/types';

interface VibeCaptureSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vibe: Omit<VibeLog, 'id' | 'date'>) => void;
}

export function VibeCaptureSheet({ isOpen, onClose, onSave }: VibeCaptureSheetProps) {
  const [humor, setHumor] = useState(5);
  const [fadiga, setFadiga] = useState(5);
  const [motivacao, setMotivacao] = useState(5);
  const [observacao, setObservacao] = useState('');

  const handleSave = () => {
    onSave({
      humor,
      fadiga,
      motivacao,
      observacao: observacao || undefined
    });
    
    // Reset form
    setHumor(5);
    setFadiga(5);
    setMotivacao(5);
    setObservacao('');
    onClose();
  };

  const getVibeEmoji = (value: number) => {
    if (value <= 3) return '😔';
    if (value <= 6) return '😐';
    if (value <= 8) return '😊';
    return '🔥';
  };

  const getEnergyEmoji = (value: number) => {
    if (value <= 3) return '🔋';
    if (value <= 6) return '🔋🔋';
    if (value <= 8) return '⚡';
    return '⚡⚡';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="glass w-full max-w-md mx-4 mb-4 p-6 relative animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--txt)' }}>
            Como foi o treino?
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--txt-2)' }} />
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Humor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span className="font-medium" style={{ color: 'var(--txt)' }}>
                  Humor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getVibeEmoji(humor)}</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>
                  {humor}/10
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={humor}
              onChange={(e) => setHumor(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7BDcff 0%, #7BDcff ${humor * 10}%, rgba(255,255,255,0.2) ${humor * 10}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          {/* Fadiga */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span className="font-medium" style={{ color: 'var(--txt)' }}>
                  Energia
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getEnergyEmoji(fadiga)}</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>
                  {fadiga}/10
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={fadiga}
              onChange={(e) => setFadiga(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7BDcff 0%, #7BDcff ${fadiga * 10}%, rgba(255,255,255,0.2) ${fadiga * 10}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          {/* Motivação */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span className="font-medium" style={{ color: 'var(--txt)' }}>
                  Motivação
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>
                  {motivacao}/10
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={motivacao}
              onChange={(e) => setMotivacao(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #7BDcff 0%, #7BDcff ${motivacao * 10}%, rgba(255,255,255,0.2) ${motivacao * 10}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <label className="font-medium" style={{ color: 'var(--txt)' }}>
              Observações (opcional)
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Como se sentiu? Alguma dica para próximo treino?"
              className="w-full h-20 px-3 py-2 rounded-lg resize-none"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--txt)',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-medium transition-all hover:bg-white/10"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--txt)'
            }}
          >
            Pular
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)'
            }}
          >
            Salvar Vibe
          </button>
        </div>
      </div>

      <style>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(100%); 
            opacity: 0;
          }
          to { 
            transform: translateY(0); 
            opacity: 1;
          }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #7BDcff;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #7BDcff;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}