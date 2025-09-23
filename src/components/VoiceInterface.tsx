import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import '../types/speech.d.ts';

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void;
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
  className?: string;
}

export interface VoiceInterfaceRef {
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export const VoiceInterface = forwardRef<VoiceInterfaceRef, VoiceInterfaceProps>(({
  onTranscript,
  onSpeechStart,
  onSpeechEnd,
  className = ''
}, ref) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        onSpeechStart();
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        toast({
          title: "🎤 IA Captou!",
          description: `"${transcript}"`,
          duration: 3000,
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        onSpeechEnd();
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onSpeechEnd();
        toast({
          title: "Erro no microfone",
          description: "Tente novamente, atleta!",
          variant: "destructive"
        });
      };
      
      setIsEnabled(true);
    } else {
      console.warn('Speech recognition not supported');
      setIsEnabled(false);
    }
    
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onTranscript, onSpeechStart, onSpeechEnd, toast]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening && isEnabled) {
      try {
        recognitionRef.current.start();
        toast({
          title: "🎤 IA Escutando",
          description: "Fale agora com seu coach virtual!",
          duration: 2000,
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Microfone indisponível",
          description: "Verifique as permissões do navegador",
          variant: "destructive"
        });
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };
  
  const speak = (text: string) => {
    console.log("VoiceInterface.speak called with:", text);
    if (synthRef.current && text && volume > 0) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.volume = volume;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      // Enhanced voice selection
      const voices = synthRef.current.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt-BR') || 
        voice.lang.includes('pt') || 
        voice.name.toLowerCase().includes('portuguese') ||
        voice.name.toLowerCase().includes('luciana') ||
        voice.name.toLowerCase().includes('monica')
      );
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
        console.log("Using Portuguese voice:", portugueseVoice.name);
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        toast({
          title: "🗣️ IA Falando",
          description: "Seu coach virtual está respondendo",
          duration: 1500,
        });
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        toast({
          title: "Erro na síntese de voz",
          description: "Não foi possível reproduzir o áudio",
          variant: "destructive"
        });
      };
      
      synthRef.current.speak(utterance);
    }
  };
  
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  const toggleMute = () => {
    setVolume(volume === 0 ? 1 : 0);
  };
  
  // Expose speak function for parent components
  useImperativeHandle(ref, () => ({
    speak,
    stopSpeaking
  }));

  if (!isEnabled) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="p-3 rounded-full bg-surface border border-line opacity-50">
          <Mic className="w-5 h-5 text-txt-3" />
        </div>
        <span className="text-sm text-txt-3">Voz não disponível</span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 md:gap-4 ${className}`}>
      {/* Enhanced Microphone Button with Premium Design */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isSpeaking}
        className={`
          relative w-16 h-16 md:w-14 md:h-14 rounded-full flex items-center justify-center
          transition-all duration-300 flex-shrink-0 overflow-hidden
          ${isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-lg shadow-red-500/30' 
            : 'bg-gradient-to-r from-accent to-accent-2 hover:from-accent-2 hover:to-accent shadow-lg'
          }
          ${isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          text-accent-ink focus-ring
        `}
        aria-label={isListening ? "Parar gravação" : "Iniciar gravação"}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full ${
          isListening ? 'animate-ping bg-red-400/20' : 'bg-accent/20'
        }`} />
        
        {/* Icon */}
        <div className="relative z-10">
          {isListening ? (
            <MicOff className="w-8 h-8 md:w-6 md:h-6" />
          ) : (
            <Mic className="w-8 h-8 md:w-6 md:h-6" />
          )}
        </div>
        
        {/* Sparkle effect when active */}
        {(isListening || isSpeaking) && (
          <Sparkles className="absolute top-1 right-1 w-3 h-3 text-white animate-pulse" />
        )}
      </button>
      
      {/* Volume Control - Enhanced */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg glass-button hover:bg-white/20 transition-colors"
          aria-label={volume === 0 ? "Ativar som" : "Silenciar"}
        >
          {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 accent-accent"
          aria-label="Controle de volume"
        />
      </div>
      
      {/* Enhanced Status Indicator */}
      {(isListening || isSpeaking) && (
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm">
          {isListening && (
            <div className="flex items-center gap-1 md:gap-2 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="hidden md:inline font-medium">Ouvindo...</span>
              <span className="md:hidden">🎤</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-1 md:gap-2 text-accent">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="hidden md:inline font-medium">IA Falando...</span>
              <span className="md:hidden">🗣️</span>
            </div>
          )}
        </div>
      )}
      
      {/* Mobile Volume Quick Access */}
      <div className="md:hidden">
        <button
          onClick={toggleMute}
          className="p-3 rounded-lg glass-button hover:bg-white/20 transition-colors"
          aria-label={volume === 0 ? "Ativar som" : "Silenciar"}
        >
          {volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
});

VoiceInterface.displayName = 'VoiceInterface';

// Hook for easy voice interface usage
export const useVoiceInterface = () => {
  const voiceRef = useRef<VoiceInterfaceRef>(null);
  
  const speak = (text: string) => {
    if (voiceRef.current) {
      voiceRef.current.speak(text);
    }
  };
  
  const stopSpeaking = () => {
    if (voiceRef.current) {
      voiceRef.current.stopSpeaking();
    }
  };
  
  return {
    voiceRef,
    speak,
    stopSpeaking
  };
};