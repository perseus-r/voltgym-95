import { useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
interface AICoachPanelProps {
  workoutData?: any;
  onSuggestion?: (suggestion: string) => void;
}
export function AICoachPanel({
  workoutData,
  onSuggestion
}: AICoachPanelProps) {
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [responses, setResponses] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
  }>>([{
    type: 'ai',
    content: 'Olá! Sou seu coach de IA. Como posso ajudar com seu treino hoje? 💪'
  }]);
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = message;
    setMessage("");
    setResponses(prev => [...prev, {
      type: 'user',
      content: userMessage
    }]);
    setIsThinking(true);

    // Simular resposta da IA baseada em palavras-chave
    setTimeout(() => {
      let aiResponse = "";
      if (userMessage.toLowerCase().includes('peso') || userMessage.toLowerCase().includes('carga')) {
        aiResponse = "Para ajustar o peso, considere: Se conseguiu fazer todas as repetições com RPE < 7, aumente 2.5-5kg. Se RPE > 8, diminua ligeiramente. Sempre priorize a forma correta!";
      } else if (userMessage.toLowerCase().includes('descanso') || userMessage.toLowerCase().includes('pausa')) {
        aiResponse = "O descanso ideal varia: 30-60s para resistência muscular, 1-3min para hipertrofia, 3-5min para força máxima. Ajuste conforme sua recuperação e objetivos!";
      } else if (userMessage.toLowerCase().includes('rpe')) {
        aiResponse = "RPE (Rate of Perceived Exertion): 6-7 = fácil, ainda consegue conversar; 8 = moderado; 9 = difícil, quase no limite; 10 = máximo esforço. Use para ajustar intensidade!";
      } else if (userMessage.toLowerCase().includes('dor') || userMessage.toLowerCase().includes('lesão')) {
        aiResponse = "⚠️ Se sentir dor, pare imediatamente! Diferença: desconforto muscular (normal) vs dor articular/aguda (pare). Consulte um profissional se persistir.";
      } else if (userMessage.toLowerCase().includes('motivação') || userMessage.toLowerCase().includes('preguiça')) {
        aiResponse = "Lembre-se: cada treino é um investimento em você! Comece devagar, foque na consistência. 'O sucesso é a soma de pequenos esforços repetidos diariamente.' 🔥";
      } else {
        aiResponse = "Entendi sua dúvida! Para orientações específicas sobre seu treino, considere fatores como: objetivo atual, nível de experiência, e como se sente hoje. Precisa de ajuda com algo específico?";
      }
      setResponses(prev => [...prev, {
        type: 'ai',
        content: aiResponse
      }]);
      setIsThinking(false);
      onSuggestion?.(aiResponse);
    }, 1500);
  };
  const quickQuestions = ["Como ajustar o peso?", "Quanto descansar?", "O que é RPE?", "Sinto uma dor leve"];
  return <div className="glass-card p-6 mx-[5px]">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-accent animate-pulse" />
        <h3 className="text-lg font-semibold">IA Coach</h3>
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {responses.map((response, index) => <div key={index} className={`flex ${response.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${response.type === 'user' ? 'bg-accent text-accent-ink' : 'bg-surface text-txt border border-line'}`}>
              {response.content}
            </div>
          </div>)}
        
        {isThinking && <div className="flex justify-start">
            <div className="bg-surface text-txt border border-line p-3 rounded-lg text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Pensando...</span>
            </div>
          </div>}
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickQuestions.map((question, index) => <button key={index} onClick={() => {
        setMessage(question);
        handleSendMessage();
      }} className="text-xs px-3 py-1 bg-surface hover:bg-card rounded-full text-txt-2 transition-colors">
            {question}
          </button>)}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Faça uma pergunta..." onKeyPress={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-input-bg border-input-border text-txt placeholder:text-txt-3" />
        <Button onClick={handleSendMessage} disabled={!message.trim() || isThinking} className="btn-premium px-3">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>;
}