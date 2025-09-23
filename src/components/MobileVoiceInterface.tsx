import React, { useState, useRef } from 'react';
import { Mic, MicOff, MessageCircle, X } from 'lucide-react';
import { VoiceInterface, VoiceInterfaceRef } from './VoiceInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface MobileVoiceInterfaceProps {
  onTranscript: (text: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export function MobileVoiceInterface({ 
  onTranscript, 
  isVisible, 
  onToggle 
}: MobileVoiceInterfaceProps) {
  const isMobile = useIsMobile();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<VoiceInterfaceRef>(null);

  const handleTranscript = (text: string) => {
    onTranscript(text);
    toast.success("🎤 Mensagem capturada!", {
      description: `"${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`
    });
  };

  const handleSpeak = (text: string) => {
    if (voiceRef.current) {
      voiceRef.current.speak(text);
    }
  };

  if (!isMobile) {
    return null; // Only show on mobile
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isVisible && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 voice-button-large bg-accent hover:bg-accent/90 text-accent-ink shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Abrir interface de voz"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}

      {/* Full Screen Voice Interface */}
      {isVisible && (
        <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-line">
            <h2 className="text-lg font-semibold text-txt">🎤 IA Coach - Voz</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg glass-button hover:bg-white/20 transition-colors"
              aria-label="Fechar interface de voz"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
            
            {/* Status Display */}
            <div className="text-center space-y-4">
              {isListening && (
                <div className="animate-pulse">
                  <div className="w-24 h-24 mx-auto rounded-full bg-error/20 flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-error/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-error"></div>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-error">Estou ouvindo...</p>
                  <p className="text-txt-3">Fale sua pergunta agora</p>
                </div>
              )}
              
              {isSpeaking && (
                <div className="animate-pulse">
                  <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-accent/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-accent"></div>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-accent">IA falando...</p>
                  <p className="text-txt-3">Aguarde a resposta</p>
                </div>
              )}
              
              {!isListening && !isSpeaking && (
                <div>
                  <div className="w-24 h-24 mx-auto rounded-full bg-surface/50 flex items-center justify-center mb-4 border-2 border-dashed border-line">
                    <Mic className="w-12 h-12 text-txt-3" />
                  </div>
                  <p className="text-xl font-semibold text-txt">Pronto para ouvir</p>
                  <p className="text-txt-3">Toque no botão para começar</p>
                </div>
              )}
            </div>

            {/* Voice Interface */}
            <VoiceInterface
              ref={voiceRef}
              onTranscript={handleTranscript}
              onSpeechStart={() => setIsListening(true)}
              onSpeechEnd={() => setIsListening(false)}
              className="justify-center"
            />

            {/* Instructions */}
            <div className="text-center space-y-2 max-w-sm">
              <p className="text-sm text-txt-2">
                🎤 Toque no microfone e fale sua pergunta
              </p>
              <p className="text-xs text-txt-3">
                Pergunte sobre treinos, exercícios, nutrição ou progressão
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-line">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTranscript("Como melhorar meu treino de hoje?")}
                className="p-3 rounded-lg glass-button text-sm text-left hover:bg-white/10 transition-colors"
              >
                💪 Melhorar treino
              </button>
              <button
                onClick={() => handleTranscript("Análise do meu progresso")}
                className="p-3 rounded-lg glass-button text-sm text-left hover:bg-white/10 transition-colors"
              >
                📊 Ver progresso
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}