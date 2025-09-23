import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SupportButton() {
  const handleSupport = () => {
    // Could open a support modal, chat, or external link
    window.open('mailto:suporte@bora.fit?subject=Preciso de Ajuda', '_blank');
  };

  return (
    <div className="glass-card p-4 text-center opacity-60 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-center gap-2 mb-3">
        <HelpCircle className="w-5 h-5 text-accent" />
        <h3 className="text-base font-medium text-txt">Precisa de Ajuda?</h3>
      </div>
      <div className="space-y-2">
        <Button 
          onClick={handleSupport}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Contatar Suporte
        </Button>
        
        <p className="text-xs text-txt-3">
          Resposta em menos de 30min • Disponível 24/7
        </p>
      </div>
    </div>
  );
}