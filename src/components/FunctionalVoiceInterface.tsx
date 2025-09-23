import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FunctionalVoiceInterfaceProps {
  onTranscript?: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  className?: string;
}

interface FunctionalVoiceInterfaceRef {
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export const FunctionalVoiceInterface = forwardRef<FunctionalVoiceInterfaceRef, FunctionalVoiceInterfaceProps>(
  ({ onTranscript, onSpeechStart, onSpeechEnd, className = "" }, ref) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [volume, setVolume] = useState(1);
    const { toast } = useToast();
    
    const recognitionRef = useRef<any>(null);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize speech recognition
    const initializeRecognition = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Não suportado",
          description: "Reconhecimento de voz não está disponível neste navegador",
          variant: "destructive"
        });
        return null;
      }

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';
      
      recognition.onstart = () => {
        setIsListening(true);
        onSpeechStart?.();
      };
      
      recognition.onend = () => {
        setIsListening(false);
        onSpeechEnd?.();
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript?.(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onSpeechEnd?.();
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Permissão negada",
            description: "Por favor, permita o acesso ao microfone",
            variant: "destructive"
          });
        }
      };
      
      return recognition;
    };

    const startListening = () => {
      if (!recognitionRef.current) {
        recognitionRef.current = initializeRecognition();
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error starting recognition:', error);
        }
      }
    };

    const stopListening = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };

    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.volume = volume;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        // Try to use a Portuguese voice
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(voice => voice.lang.startsWith('pt'));
        if (ptVoice) {
          utterance.voice = ptVoice;
        }
        
        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    };

    const stopSpeaking = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    const toggleMute = () => {
      setVolume(volume === 0 ? 1 : 0);
    };

    // Expose functions via ref
    useImperativeHandle(ref, () => ({
      speak,
      stopSpeaking
    }));

    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {/* Microphone Button */}
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "default" : "outline"}
          size="lg"
          className={`w-12 h-12 rounded-full ${
            isListening 
              ? 'bg-accent text-accent-ink' 
              : 'bg-surface/50 text-txt hover:bg-surface'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Status Indicator */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center gap-2">
            {isListening && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm text-txt-2">Ouvindo...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-txt-2">Falando...</span>
              </div>
            )}
          </div>
        )}

        {/* Volume Control */}
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="w-8 h-8 rounded-full"
        >
          {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
    );
  }
);

FunctionalVoiceInterface.displayName = 'FunctionalVoiceInterface';

export default FunctionalVoiceInterface;