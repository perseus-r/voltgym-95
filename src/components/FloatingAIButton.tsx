import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingAIButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingAIButton({ onClick, className = "" }: FloatingAIButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-ink z-50 transition-all duration-300 hover:scale-110 ${className}`}
      size="icon"
    >
      <Bot className="w-6 h-6" />
      <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
    </Button>
  );
}