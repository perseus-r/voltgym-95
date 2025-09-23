import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FloatingVoiceButtonProps {
  className?: string;
}

export function FloatingVoiceButton({ className = "" }: FloatingVoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const handleVoiceClick = () => {
    if (isListening) {
      // Parar escuta
      setIsListening(false);
      toast.info("🎙️ Escuta desativada");
    } else {
      // Iniciar escuta ou navegar para IA Coach
      navigate('/ia-coach');
      toast.success("🤖 Redirecionando para IA Coach");
    }
  };

  return (
    <Button
      onClick={handleVoiceClick}
      className={`
        fixed bottom-32 right-4 w-14 h-14 rounded-full shadow-lg 
        bg-gradient-to-r from-accent to-accent/80 
        hover:from-accent/90 hover:to-accent/70
        text-accent-ink z-40 transition-all duration-300 
        hover:scale-110 active:scale-95
        border-2 border-white/20
        ${className}
      `}
      size="icon"
    >
      {isListening ? (
        <>
          <MicOff className="w-6 h-6" />
          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse" />
        </>
      ) : (
        <>
          <Mic className="w-6 h-6" />
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
        </>
      )}
    </Button>
  );
}