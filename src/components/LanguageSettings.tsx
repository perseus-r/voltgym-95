import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface LanguageSettingsProps {
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export function LanguageSettings({ className = "" }: LanguageSettingsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar idioma salvado
    const savedLanguage = localStorage.getItem('app_language') || 'pt';
    setSelectedLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    setIsLoading(true);
    
    try {
      // Salvar no localStorage
      localStorage.setItem('app_language', languageCode);
      setSelectedLanguage(languageCode);
      
      const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
      
      if (languageCode === 'pt') {
        toast.success(`✅ Idioma alterado para ${selectedLang?.name}`, {
          description: "Configuração salva com sucesso!"
        });
      } else {
        toast.info(`🚧 ${selectedLang?.name} em desenvolvimento`, {
          description: "Esta funcionalidade será disponibilizada em breve. Por enquanto, apenas Português está disponível."
        });
        
        // Reverter para português
        localStorage.setItem('app_language', 'pt');
        setSelectedLanguage('pt');
      }
    } catch (error) {
      toast.error("Erro ao alterar idioma");
      console.error("Language change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`glass-card p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-txt">Idioma do Aplicativo</h3>
          <p className="text-sm text-txt-2">Escolha seu idioma preferido</p>
        </div>
      </div>

      <div className="space-y-3">
        <Select 
          value={selectedLanguage} 
          onValueChange={handleLanguageChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full bg-input-bg border-input-border">
            <SelectValue placeholder="Selecione um idioma" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {lang.code !== 'pt' && (
                    <span className="text-xs text-yellow-500 ml-2">(em breve)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-xs text-txt-3 bg-surface/50 p-3 rounded-lg">
          <p className="font-medium mb-1">ℹ️ Informação:</p>
          <p>Atualmente apenas Português está totalmente implementado. Outros idiomas serão adicionados nas próximas atualizações.</p>
        </div>
      </div>
    </Card>
  );
}